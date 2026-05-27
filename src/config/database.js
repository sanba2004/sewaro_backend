const { Sequelize } = require('sequelize');
//require('dotenv').config();


require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // Keeps your terminal clean
    dialectOptions: {
      ssl: {
        // 🛡️ Required for Aiven Cloud to accept the incoming connection
        rejectUnauthorized: false 
      }
    }
  }
);

module.exports = sequelize;