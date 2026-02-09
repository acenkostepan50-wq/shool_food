const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '0001',
  host: 'localhost',
  port: 5432,
  database: 'school_food'
});

module.exports = pool;