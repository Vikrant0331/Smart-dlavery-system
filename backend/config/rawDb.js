const mysql = require('mysql2/promise');

// Create a connection pool for MySQL using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smart_delivery',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the connection pool to be used across Express route handlers
module.exports = pool;
