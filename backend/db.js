// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',             // normalmente é 'postgres'
  host: 'localhost',            // se for local, é 'localhost'
  database: 'residuos',         // substitua pelo nome do SEU banco
  password: 'sidartagautama',             // senha que você criou no PostgreSQL
  port: 5432,                   // porta padrão do PostgreSQL
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
