const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Package = sequelize.define('Package', {
  package_id: { type: DataTypes.STRING, primaryKey: true, field: 'package_id' },
  parent_tracking_id: { type: DataTypes.STRING, allowNull: false },
  package_type: { type: DataTypes.STRING },
  package_profile: { type: DataTypes.STRING },
  has_hollow: { type: DataTypes.STRING },
  dimensions_str: { type: DataTypes.STRING },
  cbm_value: { type: DataTypes.STRING }
}, { tableName: 'shipment_package', timestamps: false });

module.exports = Package;