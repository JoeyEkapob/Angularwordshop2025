const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '210.246.200.99',
  user: 'worldmax_angular2025',
  password: 'boomz123',
  database: 'worldmax_angular2025',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


module.exports = pool;
