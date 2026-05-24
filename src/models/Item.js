const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'item_id' },
  parent_package_id: { type: DataTypes.STRING, allowNull: false },
  item_description: { type: DataTypes.STRING },
  item_weight: { type: DataTypes.STRING },
  item_qty: { type: DataTypes.INTEGER },
  item_price: { type: DataTypes.DECIMAL(10, 2) },
  hs_code: { type: DataTypes.STRING }
}, { tableName: 'package_item', timestamps: false });

module.exports = Item;