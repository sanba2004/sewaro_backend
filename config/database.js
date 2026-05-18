const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  'universal_logistics', // Database name
  'root',                // MySQL username
  '',                    // MySQL password 
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,      // Toggle to console.log to watch auto-generated SQL scripts
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;