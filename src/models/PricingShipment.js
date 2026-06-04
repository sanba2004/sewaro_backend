const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PricingShipment = sequelize.define('PricingShipment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sender_country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    receiver_country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tier_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    min_weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    max_weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    rate_per_kg: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'pricing_shipments', // 🌟 Secure isolated table name
    timestamps: true,
    indexes: [
        {
            name: 'shipment_route_weight_idx',
            fields: ['sender_country', 'receiver_country']
        }
    ]
});

module.exports = PricingShipment;