const sql = require('mssql');

// ADICIONAR SUAS CREDENCIAIS DO AZURE AQUI
const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true, // Para Azure SQL
    trustServerCertificate: false,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let poolPromise;

const getPool = async () => {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(dbConfig)
      .connect()
      .then(pool => {
        console.log('✅ Conectado ao Azure SQL Database');
        return pool;
      })
      .catch(err => {
        console.error('❌ Erro na conexão com o banco:', err);
        throw err;
      });
  }
  return poolPromise;
};

// Função para executar queries
const executeQuery = async (query, params = {}) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Adicionar parâmetros à query
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
    
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Erro na query:', error);
    throw error;
  }
};

// Função para executar stored procedures
const executeProcedure = async (procedureName, params = {}) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
    
    const result = await request.execute(procedureName);
    return result.recordset;
  } catch (error) {
    console.error('Erro na stored procedure:', error);
    throw error;
  }
};

module.exports = {
  sql,
  getPool,
  executeQuery,
  executeProcedure
};