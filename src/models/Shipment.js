const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shipment = sequelize.define('Shipment', {
  tracking_id: { type: DataTypes.STRING, primaryKey: true, field: 'tracking_id' },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  sender_name: { type: DataTypes.STRING },
  sender_country: { type: DataTypes.STRING },
  sender_state: { type: DataTypes.STRING },
  sender_zipcode: { type: DataTypes.STRING },
  sender_id_front_url: { type: DataTypes.STRING },
receiver_id_url: {
    type: DataTypes.STRING,
    field: 'receiver_id_url' // 🌟 Instructs Sequelize to look for your altered database column
},  sender_type: { type: DataTypes.STRING },
  sender_city: { type: DataTypes.STRING },
  sender_address: { type: DataTypes.TEXT },
  sender_contact_num: { type: DataTypes.STRING },
  sender_id_type: { type: DataTypes.STRING },
  receiver_name: { type: DataTypes.STRING },
  receiver_contact: { type: DataTypes.STRING },
  receiver_country: { type: DataTypes.STRING },
  receiver_city: { type: DataTypes.STRING },
  receiver_address: { type: DataTypes.TEXT },
  receiver_zip: { type: DataTypes.STRING },
  receiver_landmark: { type: DataTypes.STRING },
  receiver_state: { type: DataTypes.STRING },
  billing_method: { type: DataTypes.STRING },
  billing_total: { type: DataTypes.DECIMAL(10, 2) },
  total_weight_str: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.STRING, defaultValue: 'Confirmed' }
}, { tableName: 'shipment', timestamps: false });


module.exports = Shipment;
