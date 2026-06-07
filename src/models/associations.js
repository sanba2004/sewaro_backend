
const Shipment = require('./Shipment');
const Package = require('./Package');
const Item = require('./Item');
const User = require('./User'); 

function applyAssociations() {

    Shipment.belongsTo(User, { foreignKey: 'user_id' });
    User.hasMany(Shipment, { foreignKey: 'user_id' });

    Shipment.hasMany(Package, { foreignKey: 'parent_tracking_id', as: 'packages' });
    Package.belongsTo(Shipment, { foreignKey: 'parent_tracking_id' });

    Package.hasMany(Item, { foreignKey: 'parent_package_id', as: 'items' });
    Item.belongsTo(Package, { foreignKey: 'parent_package_id' });
}

module.exports = { applyAssociations };