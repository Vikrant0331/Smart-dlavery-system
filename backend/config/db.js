const { Sequelize } = require('sequelize');

// Connection configuration for MySQL database using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME || 'smart_delivery',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
