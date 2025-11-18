const express = require('express');
const { executeQuery, executeProcedure } = require('../config/database');

const router = express.Router();

// Buscar livros por gênero
router.get('/genero/:genero', async (req, res) => {
  try {
    const { genero } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const livros = await executeQuery(
      `SELECT id, titulo, autor, descricao, capa_url, ano_publicacao, 
              paginas, genero, nota_media, total_avaliacoes
       FROM livros 
       WHERE genero = @genero
       ORDER BY nota_media DESC, total_avaliacoes DESC
       OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`,
      {
        genero,
        offset: (page - 1) * limit,
        limit: parseInt(limit)
      }
    );

    const total = await executeQuery(
      'SELECT COUNT(*) as total FROM livros WHERE genero = @genero',
      { genero }
    );

    res.json({
      success: true,
      genero,
      livros,
      paginacao: {
        pagina: parseInt(page),
        limite: parseInt(limit),
        total: total[0].total,
        totalPaginas: Math.ceil(total[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    res.status(500).json({
      error: 'Erro interno ao buscar livros'
    });
  }
});

// Buscar livros por autor
router.get('/autor/:autor', async (req, res) => {
  try {
    const { autor } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const livros = await executeQuery(
      `SELECT id, titulo, autor, descricao, capa_url, ano_publicacao, 
              paginas, genero, nota_media, total_avaliacoes
       FROM livros 
       WHERE autor LIKE '%' + @autor + '%'
       ORDER BY ano_publicacao DESC
       OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`,
      {
        autor,
        offset: (page - 1) * limit,
        limit: parseInt(limit)
      }
    );

    res.json({
      success: true,
      autor,
      livros,
      total: livros.length
    });

  } catch (error) {
    console.error('Erro ao buscar livros por autor:', error);
    res.status(500).json({
      error: 'Erro interno ao buscar livros'
    });
  }
});

// Buscar livro por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const livro = await executeQuery(
      `SELECT l.*, 
              (SELECT STRING_AGG(g.gato_nome, ', ') 
               FROM gatos_indicacoes gi 
               JOIN gatos g ON gi.gato_id = g.id 
               WHERE gi.livro_id = l.id) as gatos_indicadores
       FROM livros l 
       WHERE l.id = @id`,
      { id }
    );

    if (livro.length === 0) {
      return res.status(404).json({
        error: 'Livro não encontrado'
      });
    }

    // Buscar avaliações do livro
    const avaliacoes = await executeQuery(
      `SELECT a.*, u.nome as usuario_nome 
       FROM avaliacoes a 
       JOIN usuarios u ON a.usuario_id = u.id 
       WHERE a.livro_id = @id 
       ORDER BY a.data_avaliacao DESC 
       LIMIT 10`,
      { id }
    );

    res.json({
      success: true,
      livro: {
        ...livro[0],
        avaliacoes
      }
    });

  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    res.status(500).json({
      error: 'Erro interno ao buscar livro'
    });
  }
});

// Buscar livros em destaque
router.get('/destaques/aleatorios', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    // ADIÇÃO: Buscar livros aleatórios em destaque
    const livrosDestaque = await executeProcedure('sp_ObterLivrosDestaque', {
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      livros: livrosDestaque,
      total: livrosDestaque.length,
      message: 'Livros em destaque selecionados pelos nossos gatos!'
    });

  } catch (error) {
    console.error('Erro ao buscar livros em destaque:', error);
    res.status(500).json({
      error: 'Erro interno ao buscar livros em destaque'
    });
  }
});

module.exports = router;