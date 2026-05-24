// Go up two levels from src/models to get to root/models
const Shipment = require('./Shipment');
const Package = require('./Package');
const Item = require('./Item');

function applyAssociations() {
    Shipment.hasMany(Package, { foreignKey: 'parent_tracking_id', as: 'packages' });
    Package.belongsTo(Shipment, { foreignKey: 'parent_tracking_id' });

    Package.hasMany(Item, { foreignKey: 'parent_package_id', as: 'items' });
    Item.belongsTo(Package, { foreignKey: 'parent_package_id' });
}

module.exports = { applyAssociations };