
// const Shipment = require('./Shipment');
// const Package = require('./Package');
// const Item = require('./Item');
// const User = require('./User'); 

// function applyAssociations() {

//     Shipment.belongsTo(User, { foreignKey: 'user_id' });
//     User.hasMany(Shipment, { foreignKey: 'user_id' });

//     Shipment.hasMany(Package, { foreignKey: 'parent_tracking_id', as: 'packages' });
//     Package.belongsTo(Shipment, { foreignKey: 'parent_tracking_id' });

//     Package.hasMany(Item, { foreignKey: 'parent_package_id', as: 'items' });
//     Item.belongsTo(Package, { foreignKey: 'parent_package_id' });
// }

// module.exports = { applyAssociations };
const Shipment = require('./Shipment');
const Package = require('./Package');
const Item = require('./Item');
const User = require('./User'); 

function applyAssociations() {
    // 👤 User <-> Shipment Relationship
    // Connects users.id to shipments.user_id
    Shipment.belongsTo(User, { foreignKey: 'user_id' });
    User.hasMany(Shipment, { foreignKey: 'user_id' });

    // 📦 Shipment <-> Package Relationship
    // CRITICAL: Explicitly map sourceKey and targetKey to tracking_id instead of the standard 'id' column!
    Shipment.hasMany(Package, { 
        foreignKey: 'parent_tracking_id', 
        sourceKey: 'tracking_id', // The unique field inside the Shipment model
        as: 'packages' 
    });
    Package.belongsTo(Shipment, { 
        foreignKey: 'parent_tracking_id', 
        targetKey: 'tracking_id'  // Matches tracking_id on the parent Shipment model
    });

    // 🏷️ Package <-> Item Relationship
    // If Package uses package_id as its unique key instead of standard auto-incrementing id, map it explicitly:
    Package.hasMany(Item, { 
        foreignKey: 'parent_package_id', 
        sourceKey: 'package_id', // Swap to 'id' if Package's primary key is literally named 'id'
        as: 'items' 
    });
    Item.belongsTo(Package, { 
        foreignKey: 'parent_package_id', 
        targetKey: 'package_id'  // Swap to 'id' if Package's primary key is literally named 'id'
    });
}

module.exports = { applyAssociations };