const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requests por IP
});
app.use(limiter);

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/preferencias', require('./routes/preferencias'));
app.use('/api/contato', require('./routes/contato'));
app.use('/api/livros', require('./routes/livros'));

// Rota de health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Os Gatos Indicam API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota padrão
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API Os Gatos Indicam! 🐱',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/usuarios',
      preferencias: '/api/preferencias',
      contato: '/api/contato',
      livros: '/api/livros'
    }
  });
});

// Middleware de erro 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.originalUrl} não existe nesta API`
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🐱 Servidor Os Gatos Indicam rodando na porta ${PORT}`);
  console.log(`📚 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;