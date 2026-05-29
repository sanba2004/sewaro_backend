// // src/models/PricingTier.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const PricingTier = sequelize.define('PricingTier', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     tier_name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     min_weight: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false,
//         defaultValue: 0.00
//     },
//     max_weight: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false
//     },
//     rate_per_kg: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false
//     }
// }, {
//     tableName: 'pricing_tiers',
//     timestamps: true
// });

// module.exports = PricingTier;


// src/models/PricingTier.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PricingTier = sequelize.define('PricingTier', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // 🎯 NEW FIELD: Groups weight matrix tiers by destination country
    destination_country: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Malaysia' // Backwards compatibility for existing records
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
    tableName: 'pricing_tiers',
    timestamps: true
});

module.exports = PricingTier;