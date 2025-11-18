const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery, executeProcedure } = require('../config/database');

const router = express.Router();

// Validações para contato
const validarContato = [
  body('nome').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('assunto').isIn(['duvida', 'sugestao', 'problema', 'parceria', 'outro']).withMessage('Assunto inválido'),
  body('mensagem').trim().isLength({ min: 10 }).withMessage('Mensagem deve ter pelo menos 10 caracteres'),
  body('telefone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido')
];

// Enviar mensagem de contato
router.post('/enviar', validarContato, async (req, res) => {
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
      telefone,
      assunto,
      mensagem
    } = req.body;

    // ADIÇÃO: Salvar mensagem no banco
    await executeProcedure('sp_SalvarMensagemContato', {
      nome,
      email,
      telefone: telefone || null,
      assunto,
      mensagem
    });

    res.json({
      success: true,
      message: 'Mensagem enviada com sucesso! Nossos gatos entrarão em contato em breve.'
    });

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({
      error: 'Erro interno ao enviar mensagem'
    });
  }
});

// Listar mensagens de contato (para admin)
router.get('/mensagens', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'pendente' } = req.query;

    const mensagens = await executeQuery(
      `SELECT id, nome, email, assunto, mensagem, data_envio, status 
       FROM contato_mensagens 
       WHERE status = @status
       ORDER BY data_envio DESC
       OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`,
      {
        status,
        offset: (page - 1) * limit,
        limit: parseInt(limit)
      }
    );

    const total = await executeQuery(
      'SELECT COUNT(*) as total FROM contato_mensagens WHERE status = @status',
      { status }
    );

    res.json({
      success: true,
      mensagens,
      paginacao: {
        pagina: parseInt(page),
        limite: parseInt(limit),
        total: total[0].total,
        totalPaginas: Math.ceil(total[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({
      error: 'Erro interno ao buscar mensagens'
    });
  }
});

module.exports = router;