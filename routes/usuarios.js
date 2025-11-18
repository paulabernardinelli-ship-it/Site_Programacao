const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { executeQuery, executeProcedure } = require('../config/database');

const router = express.Router();

// Validações para cadastro de usuário
const validarCadastro = [
  body('nome').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('idade').isInt({ min: 12, max: 120 }).withMessage('Idade deve ser entre 12 e 120 anos'),
  body('telefone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido'),
  body('cep').isPostalCode('BR').withMessage('CEP inválido'),
  body('logradouro').notEmpty().withMessage('Logradouro é obrigatório'),
  body('numero').notEmpty().withMessage('Número é obrigatório'),
  body('bairro').notEmpty().withMessage('Bairro é obrigatório'),
  body('cidade').notEmpty().withMessage('Cidade é obrigatória'),
  body('estado').isLength({ min: 2, max: 2 }).withMessage('Estado deve ter 2 caracteres')
];

// Cadastrar novo usuário
router.post('/cadastro', validarCadastro, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const {
      nome,
      email,
      idade,
      telefone,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado
    } = req.body;

    // Verificar se usuário já existe
    const usuarioExistente = await executeQuery(
      'SELECT id FROM usuarios WHERE email = @email',
      { email }
    );

    if (usuarioExistente.length > 0) {
      return res.status(409).json({
        error: 'E-mail já cadastrado',
        message: 'Já existe um usuário com este e-mail'
      });
    }

    // ADIÇÃO: Inserir usuário no banco
    const resultado = await executeProcedure('sp_CadastrarUsuario', {
      nome,
      email,
      idade,
      telefone: telefone || null,
      cep,
      logradouro,
      numero,
      complemento: complemento || null,
      bairro,
      cidade,
      estado
    });

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      usuario: {
        id: resultado[0].id,
        nome,
        email
      }
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({
      error: 'Erro interno no cadastro',
      message: 'Não foi possível completar o cadastro'
    });
  }
});

// Buscar usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await executeQuery(
      `SELECT id, nome, email, idade, telefone, cep, logradouro, numero, 
              complemento, bairro, cidade, estado, data_cadastro 
       FROM usuarios WHERE id = @id`,
      { id }
    );

    if (usuario.length === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      usuario: usuario[0]
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      error: 'Erro interno ao buscar usuário'
    });
  }
});

// Atualizar usuário
router.put('/:id', validarCadastro, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const {
      nome,
      email,
      idade,
      telefone,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado
    } = req.body;

    // ADIÇÃO: Atualizar usuário no banco
    await executeProcedure('sp_AtualizarUsuario', {
      id,
      nome,
      email,
      idade,
      telefone: telefone || null,
      cep,
      logradouro,
      numero,
      complemento: complemento || null,
      bairro,
      cidade,
      estado
    });

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      error: 'Erro interno ao atualizar usuário'
    });
  }
});

module.exports = router;