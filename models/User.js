const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true , field: 'id'},
  full_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'customer' },
  is_verified: { type: DataTypes.INTEGER, defaultValue: 0 },
  otp_code: { type: DataTypes.STRING }
}, { tableName: 'users', timestamps: false });

module.exports = User;