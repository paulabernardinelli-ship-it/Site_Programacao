const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery, executeProcedure } = require('../config/database');

const router = express.Router();

// Validações para preferências
const validarPreferencias = [
  body('usuario_id').isInt().withMessage('ID do usuário é obrigatório'),
  body('generos').isArray().withMessage('Gêneros devem ser um array'),
  body('autores_favoritos').optional().isString(),
  body('frequencia_leitura').optional().isIn(['diariamente', 'semanalmente', 'mensalmente', 'raramente']),
  body('horario_preferido').optional().isIn(['manha', 'tarde', 'noite', 'madrugada']),
  body('livros_mes').optional().isIn(['1-2', '3-4', '5+', 'varia']),
  body('formatos_preferidos').optional().isArray()
];

// Salvar/Atualizar preferências
router.post('/salvar', validarPreferencias, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const {
      usuario_id,
      generos,
      autores_favoritos,
      frequencia_leitura,
      horario_preferido,
      livros_mes,
      formatos_preferidos,
      descricao
    } = req.body;

    // ADIÇÃO: Salvar preferências no banco
    await executeProcedure('sp_SalvarPreferencias', {
      usuario_id,
      generos: JSON.stringify(generos),
      autores_favoritos: autores_favoritos || null,
      frequencia_leitura: frequencia_leitura || null,
      horario_preferido: horario_preferido || null,
      livros_mes: livros_mes || null,
      formatos_preferidos: formatos_preferidos ? JSON.stringify(formatos_preferidos) : null,
      descricao: descricao || null
    });

    res.json({
      success: true,
      message: 'Preferências salvas com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao salvar preferências:', error);
    res.status(500).json({
      error: 'Erro interno ao salvar preferências'
    });
  }
});

// Buscar preferências do usuário
router.get('/usuario/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const preferencias = await executeQuery(
      `SELECT * FROM preferencias WHERE usuario_id = @usuario_id`,
      { usuario_id }
    );

    if (preferencias.length === 0) {
      return res.status(404).json({
        error: 'Preferências não encontradas'
      });
    }

    // Converter JSON strings de volta para objetos
    const pref = preferencias[0];
    if (pref.generos) pref.generos = JSON.parse(pref.generos);
    if (pref.formatos_preferidos) pref.formatos_preferidos = JSON.parse(pref.formatos_preferidos);

    res.json({
      success: true,
      preferencias: pref
    });

  } catch (error) {
    console.error('Erro ao buscar preferências:', error);
    res.status(500).json({
      error: 'Erro interno ao buscar preferências'
    });
  }
});

// Gerar recomendações baseadas nas preferências
router.get('/recomendacoes/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;

    // ADIÇÃO: Buscar recomendações personalizadas
    const recomendacoes = await executeProcedure('sp_ObterRecomendacoes', {
      usuario_id
    });

    res.json({
      success: true,
      recomendacoes,
      total: recomendacoes.length,
      message: `Nossos gatos selecionaram ${recomendacoes.length} livros para você!`
    });

  } catch (error) {
    console.error('Erro ao gerar recomendações:', error);
    res.status(500).json({
      error: 'Erro interno ao gerar recomendações'
    });
  }
});

module.exports = router;