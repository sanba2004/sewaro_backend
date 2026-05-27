const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true , field: 'id'},
  full_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'customer' },
  agent_id: {
    type: DataTypes.STRING,
    allowNull: true, // Set to true since customers/admins won't have one
    unique: true     // Keeps it strictly non-repeatable at the database layer
  },
  is_verified: { type: DataTypes.INTEGER, defaultValue: 0 },
  otp_code: { type: DataTypes.STRING },
  created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW,
    field: 'created_at' 
  }
}, { tableName: 'users', timestamps: false });


module.exports = User;