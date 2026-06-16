// const sequelize = require('../config/database');
// const Shipment = require('../models/Shipment');
// const Package = require('../models/Package');
// const Item = require('../models/Item');
// const { Op } = require('sequelize');

// class ShipmentService {
//     // async createNestedShipment(userId, shipment, packages) {
//     //     return await sequelize.transaction(async (t) => {
//     //         await Shipment.create({
//     //             tracking_id: shipment.trackingId,
//     //             user_id: userId,
//     //             sender_name: shipment.senderName,
//     //             sender_country: shipment.senderCountry,
//     //             sender_state: shipment.senderState,
//     //             sender_zipcode: shipment.senderZip,
//     //             sender_id_front_url: shipment.senderIdFront,
//     //             receiver_id_url: shipment.receiverIdUrl,
//     //             sender_type: shipment.senderType,
//     //             sender_city: shipment.senderCity,
//     //             sender_address: shipment.senderAddress,
//     //             sender_contact_num: shipment.senderContact,
//     //             sender_id_type: shipment.senderIdType,
//     //             receiver_name: shipment.receiverName,
//     //             receiver_contact: shipment.receiverContact,
//     //             receiver_country: shipment.receiverCountry,
//     //             receiver_city: shipment.receiverCity,
//     //             receiver_address: shipment.receiverAddress,
//     //             receiver_zip: shipment.receiverZip,
//     //             receiver_landmark: shipment.receiverLandmark,
//     //             receiver_state: shipment.receiverState,
//     //             billing_method: shipment.billingMethod,
//     //             billing_total: shipment.billingTotal,
//     //             total_weight_str: shipment.weight,
//     //             created_at: shipment.date,
//     //             status: "Confirmed"
//     //         }, { transaction: t });

//     //         for (const pkg of packages) {
//     //             await Package.create({
//     //                 package_id: pkg.packageId,
//     //                 parent_tracking_id: shipment.trackingId,
//     //                 package_type: pkg.type,
//     //                 package_profile: pkg.profile,
//     //                 has_hollow: pkg.hasHollow,
//     //                 dimensions_str: pkg.dims,
//     //                 cbm_value: pkg.cbm
//     //             }, { transaction: t });

//     //             for (const item of pkg.items) {
//     //                 await Item.create({
//     //                     parent_package_id: pkg.packageId,
//     //                     item_description: item.desc,
//     //                     item_weight: item.weight,
//     //                     item_qty: item.qty,
//     //                     item_price: item.price,
//     //                     hs_code: item.hsCode
//     //                 }, { transaction: t });
//     //             }
//     //         }
//     //     });
//     // }


//     async createNestedShipment(userId, shipment, packages) {
//     return await sequelize.transaction(async (t) => {
//         await Shipment.create({
//             tracking_id: shipment.trackingId,
//             user_id: userId,
//             sender_name: shipment.senderName,
//             sender_country: shipment.senderCountry,
//             sender_state: shipment.senderState,
//             sender_zipcode: shipment.senderZip,
//             sender_id_front_url: shipment.senderIdFront,
//             receiver_id_url: shipment.receiverIdUrl,
//             sender_type: shipment.senderType,
//             sender_city: shipment.senderCity,
//             sender_address: shipment.senderAddress,
//             sender_contact_num: shipment.senderContact,
//             sender_id_type: shipment.senderIdType,
//             receiver_name: shipment.receiverName,
//             receiver_contact: shipment.receiverContact,
//             receiver_country: shipment.receiverCountry,
//             receiver_city: shipment.receiverCity,
//             receiver_address: shipment.receiverAddress,
//             receiver_zip: shipment.receiverZip,
//             receiver_landmark: shipment.receiverLandmark,
//             receiver_state: shipment.receiverState,
//             billing_method: shipment.billingMethod,
//             billing_total: shipment.billingTotal,
//             total_weight_str: shipment.weight,
//             created_at: shipment.date,
//             status: "Confirmed"
//         }, { transaction: t });

//         for (const pkg of packages) {
//             await Package.create({
//                 package_id: pkg.packageId,
//                 parent_tracking_id: shipment.trackingId,
//                 package_type: pkg.type,
//                 package_profile: pkg.profile,
//                 has_hollow: pkg.hasHollow,
//                 dimensions_str: pkg.dims,
//                 cbm_value: pkg.cbm,
                
//                 // 🌟 FIX HERE: Catch the value sent directly from the frontend text field input
//                 total_weight: parseFloat(pkg.totalWeight) || 0.00
//             }, { transaction: t });

//             for (const item of pkg.items) {
//                 await Item.create({
//                     parent_package_id: pkg.packageId,
//                     item_description: item.desc,
//                     item_weight: item.weight,
//                     item_qty: item.qty,
//                     item_price: item.price,
//                     hs_code: item.hsCode
//                 }, { transaction: t });
//             }
//         }
//     });
// }
//     async getPagedShipments(filters) {
//         const { userId, role, dateFrom, dateTo, status, agentId, page, limit } = filters;
//         const normalizedRole = role?.toLowerCase();

//         let findOptions = { 
//             where: {},
//             order: [['created_at', 'DESC']] 
//         };

//         if (normalizedRole !== 'admin') {
//             findOptions.where.user_id = Number(userId);
//         }

//         if (dateFrom || dateTo) {
//             findOptions.where.created_at = {};
//             if (dateFrom) findOptions.where.created_at[Op.gte] = new Date(`${dateFrom}T00:00:00.000Z`);
//             if (dateTo) findOptions.where.created_at[Op.lte] = new Date(`${dateTo}T23:59:59.999Z`);
//         }
        
//         if (status && status !== 'All') findOptions.where.status = status;
//         if (normalizedRole === 'admin' && agentId && agentId !== 'All') findOptions.where.user_id = Number(agentId);

//         const activePage = parseInt(page) || 1;
//         const activeLimit = parseInt(limit) || 50;
        
//         findOptions.limit = activeLimit;
//         findOptions.offset = (activePage - 1) * activeLimit;

//         const { count, rows } = await Shipment.findAndCountAll(findOptions);
        
//         return {
//             totalItems: count,
//             totalPages: Math.ceil(count / activeLimit),
//             currentPage: activePage,
//             itemsPerPage: activeLimit,
//             shipments: rows
//         };
//     }

//     async getShipmentDetails(trackingId) {
//         return await Shipment.findOne({
//             where: { tracking_id: trackingId },
//             include: [{
//                 model: Package,
//                 as: 'packages', 
//                 required: false,
//                 include: [{
//                     model: Item,
//                     as: 'items',
//                     required: false
//                 }]
//             }]
//         });
//     }

//     async updateStatus(trackingId, status) {
//         const shipment = await Shipment.findOne({ where: { tracking_id: trackingId } });
//         if (!shipment) throw new Error(`No active records matched tracking token: ${trackingId}`);
        
//         shipment.status = status;
//         await shipment.save();
//         return status;
//     }

//     async updateCompleteShipment(trackingId, data) {
//         await sequelize.transaction(async (t) => {
//             const existingShipment = await Shipment.findOne({
//                 where: { tracking_id: trackingId },
//                 transaction: t
//             });

//             if (!existingShipment) throw new Error(`Target shipment with tracking number #${trackingId} not found.`);

//             await Shipment.update({
//                 sender_name: data.shipper_name,
//                 sender_contact_num: data.shipper_phone, 
//                 sender_address: data.shipper_address,
//                 sender_city: data.shipper_city,
//                 sender_country: data.shipper_country,
//                 receiver_name: data.receiver_name,
//                 receiver_contact: data.receiver_phone, 
//                 receiver_address: data.receiver_address,
//                 receiver_city: data.receiver_city,
//                 receiver_country: data.receiver_country,
//                 billing_method: data.payment_method, 
//                 billing_total: data.total_amount,
//                 status: data.status 
//             }, { where: { tracking_id: trackingId }, transaction: t });

//             if (data.shipment_package && Array.isArray(data.shipment_package)) {
//                 for (const pkg of data.shipment_package) {
//                     const currentPackageId = pkg.package_id || pkg.id;

//                     await Package.update({
//                         package_type: pkg.type,
//                         package_profile: pkg.profile,
//                         has_hollow: pkg.hasHollow,
//                         dimensions_str: pkg.dims || pkg.dimensions_str,
//                         cbm_value: String(pkg.cbm) ,
//                         total_weight: parseFloat(pkg.total_weight || pkg.totalWeight) || 0.00
//                     }, {
//                         where: { package_id: currentPackageId, parent_tracking_id: trackingId },
//                         transaction: t
//                     });

//                     if (pkg.shipment_item && Array.isArray(pkg.shipment_item)) {
//                         for (const item of pkg.shipment_item) {
//                             const currentItemId = item.item_id || item.id;

//                             await Item.update({
//                                 item_description: item.description,
//                                 item_qty: item.qty,
//                                 item_weight: String(item.weight),
//                                 item_price: item.price,
//                                 hs_code: item.hs_code || item.hsCode
//                             }, {
//                                 where: { id: currentItemId, parent_package_id: currentPackageId },
//                                 transaction: t
//                             });
//                         }
//                     }
//                 }
//             }
//         });
//     }
// }

// module.exports = new ShipmentService();


// Location: src/services/ShipmentService.js


const sequelize = require('../config/database');
const Shipment = require('../models/Shipment');
const Package = require('../models/Package');
const Item = require('../models/Item');
const { Op } = require('sequelize');
const User = require('../models/User');
class ShipmentService {
    async createNestedShipment(userId, shipment, packages) {
        return await sequelize.transaction(async (t) => {
            // 1. Commit the root shipment row
            await Shipment.create({
                tracking_id: shipment.trackingId,
                user_id: userId,
                sender_name: shipment.senderName,
                sender_country: shipment.senderCountry,
                sender_state: shipment.senderState,
                sender_zipcode: shipment.senderZip,
                sender_id_front_url: shipment.senderIdFront,
                receiver_id_url: shipment.receiverIdUrl,
                sender_type: shipment.senderType,
                sender_city: shipment.senderCity,
                sender_address: shipment.senderAddress,
                sender_contact_num: shipment.senderContact,
                sender_id_type: shipment.senderIdType,
                receiver_name: shipment.receiverName,
                receiver_contact: shipment.receiverContact,
                delivery_type: shipment.deliveryType,
                receiver_country: shipment.receiverCountry,
                receiver_city: shipment.receiverCity,
                receiver_address: shipment.receiverAddress,
                receiver_zip: shipment.receiverZip,
                receiver_landmark: shipment.receiverLandmark,
                receiver_state: shipment.receiverState,
                billing_method: shipment.billingMethod,
                billing_total: shipment.billingTotal,
                total_weight_str: shipment.weight, // Maps clean aggregate package weight safely
                created_at: shipment.date,
                status: "Confirmed",
                invoice_notes: shipment.invoice_notes ?? shipment.invoiceNotes
            }, { transaction: t });

            // 2. Loop through and map packages safely
            for (const pkg of packages) {
                await Package.create({
                    package_id: pkg.packageId,
                    parent_tracking_id: shipment.trackingId,
                    package_type: pkg.type,
                    package_profile: pkg.profile,
                    has_hollow: pkg.hasHollow,
                    dimensions_str: pkg.dims,
                    cbm_value: pkg.cbm,
                    
                    // 🌟 FIX: Fallback evaluation handles both camelCase and snake_case properties
                    total_weight: parseFloat(pkg.total_weight ?? pkg.totalWeight) || 0.00
                }, { transaction: t });

                // 3. Build sub-nested item manifests
                for (const item of pkg.items) {
                    await Item.create({
                        parent_package_id: pkg.packageId,
                        item_description: item.desc,
                        item_weight: item.weight,
                        item_qty: item.qty,
                        item_price: item.price,
                        hs_code: item.hsCode
                    }, { transaction: t });
                }
            }
        });
    }

    // async getPagedShipments(filters) {
    //     const { userId, role, dateFrom, dateTo, status, agentId, page, limit } = filters;
    //     const normalizedRole = role?.toLowerCase();

    //     let findOptions = { 
    //         where: {},
    //         order: [['created_at', 'DESC']] 
    //     };

    //     if (normalizedRole !== 'admin') {
    //         findOptions.where.user_id = Number(userId);
    //     }

    //     if (dateFrom || dateTo) {
    //         findOptions.where.created_at = {};
    //         if (dateFrom) findOptions.where.created_at[Op.gte] = new Date(`${dateFrom}T00:00:00.000Z`);
    //         if (dateTo) findOptions.where.created_at[Op.lte] = new Date(`${dateTo}T23:59:59.999Z`);
    //     }
        
    //     if (status && status !== 'All') findOptions.where.status = status;
    //     if (normalizedRole === 'admin' && agentId && agentId !== 'All') findOptions.where.user_id = Number(agentId);

    //     const activePage = parseInt(page) || 1;
    //     const activeLimit = parseInt(limit) || 50;
        
    //     findOptions.limit = activeLimit;
    //     findOptions.offset = (activePage - 1) * activeLimit;

    //     const { count, rows } = await Shipment.findAndCountAll(findOptions);
        
    //     return {
    //         totalItems: count,
    //         totalPages: Math.ceil(count / activeLimit),
    //         currentPage: activePage,
    //         itemsPerPage: activeLimit,
    //         shipments: rows
    //     };
    // }
    // async getPagedShipments(filters) {
    //         const { userId, role, dateFrom, dateTo, status, agentId, page, limit } = filters;
    //         const normalizedRole = role?.toLowerCase();

    //         let findOptions = { 
    //             where: {},
    //             order: [['created_at', 'DESC']],
    //             // 🌟 INJECT ASSOCIATION HERE: Eager load creator details via Left Join
    //             include: [{
    //                 model: User,
    //                 attributes: ['full_name'], // Optimize: only download the necessary name string
    //                 required: false // Left join so shipments still load if creator profile is absent
    //             }]
    //         };

    //         if (normalizedRole !== 'admin') {
    //             findOptions.where.user_id = Number(userId);
    //         }

    //         if (dateFrom || dateTo) {
    //             findOptions.where.created_at = {};
    //             if (dateFrom) findOptions.where.created_at[Op.gte] = new Date(`${dateFrom}T00:00:00.000Z`);
    //             if (dateTo) findOptions.where.created_at[Op.lte] = new Date(`${dateTo}T23:59:59.999Z`);
    //         }
            
    //         if (status && status !== 'All') findOptions.where.status = status;
    //         if (normalizedRole === 'admin' && agentId && agentId !== 'All') findOptions.where.user_id = Number(agentId);

    //         const activePage = parseInt(page) || 1;
    //         const activeLimit = parseInt(limit) || 50;
            
    //         findOptions.limit = activeLimit;
    //         findOptions.offset = (activePage - 1) * activeLimit;

    //         const { count, rows } = await Shipment.findAndCountAll(findOptions);
            
    //         return {
    //             totalItems: count,
    //             totalPages: Math.ceil(count / activeLimit),
    //             currentPage: activePage,
    //             itemsPerPage: activeLimit,
    //             shipments: rows
    //         };
    //     }
    async getPagedShipments(filters) {
        const { userId, role, dateFrom, dateTo, status, agentId, page, limit, search } = filters;
        const normalizedRole = role?.toLowerCase();

        let findOptions = { 
            where: {},
            order: [['created_at', 'DESC']],
            include: [{
                model: User,
                attributes: ['full_name'], 
                required: false 
            }]
        };

        // 1. Role-based Access Isolation Controls
        if (normalizedRole !== 'admin') {
            findOptions.where.user_id = Number(userId);
        }

        // 2. Date Bounds Matrix Range Parsing
        if (dateFrom || dateTo) {
            findOptions.where.created_at = {};
            if (dateFrom) findOptions.where.created_at[Op.gte] = new Date(`${dateFrom}T00:00:00.000Z`);
            if (dateTo) findOptions.where.created_at[Op.lte] = new Date(`${dateTo}T23:59:59.999Z`);
        }
        
        // 3. Status Filtering
        if (status && status !== 'All') findOptions.where.status = status;
        
        // 4. Admin Dropdown Filtering
        if (normalizedRole === 'admin' && agentId && agentId !== 'All') {
            findOptions.where.user_id = Number(agentId);
        }

        // 🌟 5. MULTI-FIELD SEARCH COMPILER (Fuzzy queries tracking_id, names, or contact fields)
        if (search && search.trim() !== '') {
            const searchToken = `%${search.trim()}%`;
            
            findOptions.where[Op.and] = [
                ...(findOptions.where[Op.and] || []),
                {
                    [Op.or]: [
                        { tracking_id: { [Op.like]: searchToken } },
                        { sender_name: { [Op.like]: searchToken } },
                        { sender_contact_num: { [Op.like]: searchToken } },
                        { receiver_name: { [Op.like]: searchToken } },
                        { receiver_contact: { [Op.like]: searchToken } }
                    ]
                }
            ];
        }

        // 6. Pagination offset allocations
        const activePage = parseInt(page) || 1;
        const activeLimit = parseInt(limit) || 50;
        
        findOptions.limit = activeLimit;
        findOptions.offset = (activePage - 1) * activeLimit;

        const { count, rows } = await Shipment.findAndCountAll(findOptions);
        
        return {
            totalItems: count,
            totalPages: Math.ceil(count / activeLimit),
            currentPage: activePage,
            itemsPerPage: activeLimit,
            shipments: rows
        };
    }
    async getShipmentDetails(trackingId) {
        return await Shipment.findOne({
            where: { tracking_id: trackingId },
            include: [{
                model: Package,
                as: 'packages', // Matches Sequelize association declaration targets
                required: false,
                include: [{
                    model: Item,
                    as: 'items',
                    required: false
                }]
            }]
        });
    }

    async updateStatus(trackingId, status) {
        const shipment = await Shipment.findOne({ where: { tracking_id: trackingId } });
        if (!shipment) throw new Error(`No active records matched tracking token: ${trackingId}`);
        
        shipment.status = status;
        await shipment.save();
        return status;
    }
    

    async updateCompleteShipment(trackingId, data) {
        await sequelize.transaction(async (t) => {
            const existingShipment = await Shipment.findOne({
                where: { tracking_id: trackingId },
                transaction: t
            });

            if (!existingShipment) throw new Error(`Target shipment with tracking number #${trackingId} not found.`);

            await Shipment.update({
                sender_name: data.shipper_name,
                sender_contact_num: data.shipper_phone, 
                sender_address: data.shipper_address,
                sender_city: data.shipper_city,
                sender_country: data.shipper_country,
                receiver_name: data.receiver_name,
                receiver_contact: data.receiver_phone, 
                receiver_address: data.receiver_address,
                receiver_city: data.receiver_city,
                receiver_country: data.receiver_country,
                billing_method: data.payment_method, 
                billing_total: data.total_amount,
                status: data.status ,
                invoice_notes: data.invoice_notes ?? data.invoiceNotes
            }, { where: { tracking_id: trackingId }, transaction: t });

            if (data.shipment_package && Array.isArray(data.shipment_package)) {
                for (const pkg of data.shipment_package) {
                    const currentPackageId = pkg.package_id || pkg.id;

                    await Package.update({
                        package_type: pkg.type,
                        package_profile: pkg.profile,
                        has_hollow: pkg.hasHollow,
                        dimensions_str: pkg.dims || pkg.dimensions_str,
                        cbm_value: String(pkg.cbm),
                        total_weight: parseFloat(pkg.total_weight || pkg.totalWeight) || 0.00
                    }, {
                        where: { package_id: currentPackageId, parent_tracking_id: trackingId },
                        transaction: t
                    });

                    if (pkg.shipment_item && Array.isArray(pkg.shipment_item)) {
                        for (const item of pkg.shipment_item) {
                            const currentItemId = item.item_id || item.id;

                            await Item.update({
                                item_description: item.description,
                                item_qty: item.qty,
                                item_weight: String(item.weight),
                                item_price: item.price,
                                hs_code: item.hs_code || item.hsCode
                            }, {
                                where: { id: currentItemId, parent_package_id: currentPackageId },
                                transaction: t
                            });
                        }
                    }
                }
            }
        });
    }
    async deleteBulkShipments(trackingIds) {
        return await sequelize.transaction(async (t) => {
            // Find every nested package attached to any of the matching trackingIds
            const targetedPackages = await Package.findAll({
                where: { parent_tracking_id: trackingIds },
                attributes: ['package_id'],
                transaction: t
            });

            const packageIds = targetedPackages.map(pkg => pkg.package_id);

            // Step 1: Wipe all bottom tier Manifest Items first
            if (packageIds.length > 0) {
                await Item.destroy({
                    where: { parent_package_id: packageIds },
                    transaction: t
                });
            }

            // Step 2: Wipe the structural Middle Tier Packages
            await Package.destroy({
                where: { parent_tracking_id: trackingIds },
                transaction: t
            });

            // Step 3: Clear the root Shipment records out entirely
            await Shipment.destroy({
                where: { tracking_id: trackingIds },
                transaction: t
            });
        });
    }
}


module.exports = new ShipmentService();