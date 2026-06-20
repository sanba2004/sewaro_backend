const shipmentService = require('../services/shipment.service');
const User = require('../models/User'); 

exports.confirmShipment = async (req, res) => {
    const { shipment, packages } = req.body;
    const userId = req.body.userId || shipment?.userId;

    if (!userId || isNaN(Number(userId))) {
        return res.status(400).json({ error: "Validation Mismatch: A valid numeric user identity is required." });
    }

    try {
        await shipmentService.createNestedShipment(userId, shipment, packages);
        return res.status(200).json({ message: "Shipment saved successfully!" });
    } catch (error) {
        console.error("Sequelize Transaction Error:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

exports.getAllShipments = async (req, res) => {
    const { userId, role } = req.query;
    const normalizedRole = role?.toLowerCase();

    if (normalizedRole !== 'admin' && (!userId || userId === 'undefined' || userId === 'null')) {
        return res.status(400).json({ error: "Access Denied. Identity parameter missing." });
    }

    try {
        const data = await shipmentService.getPagedShipments(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.error("ORM Ledger Fetch Error:", error.message);
        return res.status(500).json({ error: "Internal server error parsing data records." });
    }
};

// exports.trackShipment = async (req, res) => {
//     const { trackingId } = req.params;
//     try {
//         const shipmentData = await shipmentService.getShipmentDetails(trackingId);
//         if (!shipmentData) {
//             return res.status(404).json({ message: `Shipment record for ID ${trackingId} was not found.` });
//         }

//         // Exact translation contract matching your frontend's parsing logic
//         const formattedResponse = {
//             tracking_id: shipmentData.tracking_id || shipmentData.trackingId,
//             user_id: shipmentData.user_id || shipmentData.userId,
//             shipper_name: shipmentData.sender_name || shipmentData.senderName,
//             shipper_city: shipmentData.sender_city || shipmentData.senderCity,
//             sender_id_front_url: shipmentData.sender_id_front_url || shipmentData.senderIdFrontUrl || shipmentData.senderIdFront,
//             receiver_id_url: shipmentData.receiver_id_url || shipmentData.receiverIdUrl,
//             shipper_address: shipmentData.sender_address || shipmentData.senderAddress,
//             shipper_phone: shipmentData.sender_contact_num || shipmentData.senderContact,
//             shipper_country: shipmentData.sender_country || shipmentData.senderCountry,
//             receiver_name: shipmentData.receiver_name || shipmentData.receiverName,
//             receiver_phone: shipmentData.receiver_contact || shipmentData.receiverContact,
//             receiver_country: shipmentData.receiver_country || shipmentData.receiverCountry,
//             receiver_city: shipmentData.receiver_city || shipmentData.receiverCity,
//             receiver_address: shipmentData.receiver_address || shipmentData.receiverAddress,
//             created_at: shipmentData.created_at || shipmentData.createdAt,
//             status: shipmentData.status,
//             payment_method: shipmentData.billing_method || shipmentData.billingMethod,
//             currency: shipmentData.billing_currency || "NPR", 
//             total_amount: shipmentData.billing_total || shipmentData.billingTotal,
            
//             shipment_package: (shipmentData.packages || []).map(pkg => ({
//                 id: pkg.package_id || pkg.packageId,
//                 type: pkg.package_type || pkg.packageType,
//                 profile: pkg.package_profile || pkg.packageProfile,
//                 hasHollow: pkg.has_hollow || pkg.hasHollow,
//                 cbm: parseFloat(pkg.cbm_value || pkg.cbmValue) || 0,
                
//                 shipment_item: (pkg.items || []).map(item => ({
//                     id: item.item_id || item.itemId || item.id,
//                     description: item.item_description || item.itemDescription,
//                     qty: parseInt(item.item_qty || item.itemQty) || 1,
//                     price: parseFloat(item.item_price || item.itemPrice) || 0,
//                     weight: parseFloat(item.item_weight || item.itemWeight) || 0,
//                     hs_code: item.hs_code || item.hsCode
//                 }))
//             }))
//         };

//         return res.status(200).json(formattedResponse);
//     } catch (error) {
//         console.error("Backend Error:", error);
//         return res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
// };
exports.trackShipment = async (req, res) => {
    const { trackingId } = req.params;
    try {
        const shipmentData = await shipmentService.getShipmentDetails(trackingId);
        if (!shipmentData) {
            return res.status(404).json({ message: `Shipment record for ID ${trackingId} was not found.` });
        }

        // Exact translation contract matching your frontend's parsing logic
        const formattedResponse = {
            tracking_id: shipmentData.tracking_id || shipmentData.trackingId,
            user_id: shipmentData.user_id || shipmentData.userId,
            shipper_name: shipmentData.sender_name || shipmentData.senderName,
            shipper_city: shipmentData.sender_city || shipmentData.senderCity,
            sender_id_front_url: shipmentData.sender_id_front_url || shipmentData.senderIdFrontUrl || shipmentData.senderIdFront,
            receiver_id_url: shipmentData.receiver_id_url || shipmentData.receiverIdUrl,
            shipper_address: shipmentData.sender_address || shipmentData.senderAddress,
            shipper_phone: shipmentData.sender_contact_num || shipmentData.senderContact,
            shipper_country: shipmentData.sender_country || shipmentData.senderCountry,
            receiver_name: shipmentData.receiver_name || shipmentData.receiverName,
            receiver_phone: shipmentData.receiver_contact || shipmentData.receiverContact,
            receiver_country: shipmentData.receiver_country || shipmentData.receiverCountry,
            receiver_city: shipmentData.receiver_city || shipmentData.receiverCity,
            receiver_address: shipmentData.receiver_address || shipmentData.receiverAddress,
            created_at: shipmentData.created_at || shipmentData.createdAt,
            status: shipmentData.status,
            payment_method: shipmentData.billing_method || shipmentData.billingMethod,
            currency: shipmentData.billing_currency || "NPR", 
            total_amount: shipmentData.billing_total || shipmentData.billingTotal,
            invoice_notes: shipmentData.invoice_notes,
            delivery_type: shipmentData.delivery_type ,
            // 🌟 FIXED PACKAGE MAPPING LAYER:
            shipment_package: (shipmentData.packages || []).map(pkg => ({
                id: pkg.package_id || pkg.id,
                package_id: pkg.package_id || pkg.id,
                type: pkg.package_type || pkg.type,
                profile: pkg.package_profile || pkg.profile,
                hasHollow: pkg.has_hollow || pkg.hasHollow,
                dims: pkg.dimensions_str || pkg.dims,
                cbm: parseFloat(pkg.cbm_value || pkg.cbm) || 0,
                
                // 🌟 FIX: Explicitly send total_weight so the frontend detail view sees it!
                total_weight: parseFloat(pkg.total_weight || pkg.totalWeight) || 0.00,
                
                shipment_item: (pkg.items || []).map(item => ({
                    id: item.item_id || item.itemId || item.id,
                    description: item.item_description || item.description,
                    qty: parseInt(item.item_qty || item.qty) || 1,
                    price: parseFloat(item.item_price || item.price) || 0,
                    weight: parseFloat(item.item_weight || item.weight) || 0,
                    hs_code: item.hs_code || item.hsCode
                }))
            }))
        };

        return res.status(200).json(formattedResponse);
    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    const { trackingId, status } = req.body;
    if (!trackingId || !status) {
        return res.status(400).json({ error: "Required payload parameters trackingId or status state properties are absent." });
    }
    try {
        const updatedStatus = await shipmentService.updateStatus(trackingId, status);
        return res.status(200).json({ message: "Logistics status state successfully saved.", status: updatedStatus });
    } catch (error) {
        return res.status(500).json({ error: "Internal operational update engine fault.", details: error.message });
    }
};

// exports.updateShipmentDetails = async (req, res) => {
//     const { trackingId } = req.params;
//     if (!trackingId || !req.body) {
//         return res.status(400).json({ error: "Validation Mismatch: Missing tracking ID or update payload data." });
//     }
//     try {
//         await shipmentService.updateCompleteShipment(trackingId, req.body);
//         return res.status(200).json({ message: `Shipment #${trackingId} records successfully replaced!` });
//     } catch (error) {
//         return res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
// };
exports.updateShipmentDetails = async (req, res) => {
    const { trackingId } = req.params;
    
    // 1. 🌟 FIX: Extract 'receiver_contact' from req.body to match your frontend data keys!
    const { status, receiver_contact, triggerSMS } = req.body;

    if (!trackingId || !req.body) {
        return res.status(400).json({ error: "Validation Mismatch: Missing tracking ID or update payload data." });
    }

    try {
        // 2. Execute your standard service ledger update logic to save tracking values
        await shipmentService.updateCompleteShipment(trackingId, req.body);

        // 3. Intercept and execute the automated Nest SMS alert if the flag is active
        if (triggerSMS && receiver_contact) {
            const cleanPhone = receiver_contact.trim();
            
            const nestSmsPayload = {
                to: cleanPhone,
                // 🌟 FIX: Using process.env.NEST_SMS_TEMPLATE_ID instead of a hardcoded string!
                template_id: process.env.NEST_SMS_TEMPLATE_ID 
            };

            // Dispatch payload out to the Nest SMS gateway cloud
            const smsResponse = await fetch('https://auth.nestsms.com/api/v1/sms/send', {
                method: 'POST',
                headers: {
                    'X-API-Key': process.env.NEST_SMS_KEY, // Pulled from your safe .env file setup
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nestSmsPayload)
            });

            const smsResult = await smsResponse.json();

            if (!smsResponse.ok) {
                console.error(`⚠️ SMS Delivery pipeline failed for shipment ${trackingId}:`, smsResult);
            } else {
                console.log(`💬 Notification text cleanly delivered to ${cleanPhone}. Message ID: ${smsResult.message_id || smsResult.batch_id}`);
            }
        }

        return res.status(200).json({ message: `Shipment #${trackingId} records successfully replaced!` });

    } catch (error) {
        console.error("Critical update exception inside Controller:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


exports.deleteBulkShipments = async (req, res) => {
    const { trackingIds } = req.body;

    if (!trackingIds || !Array.isArray(trackingIds) || trackingIds.length === 0) {
        return res.status(400).json({ error: "Validation Mismatch: A non-empty trackingIds array parameter is required." });
    }

    try {
        await shipmentService.deleteBulkShipments(trackingIds);
        return res.status(200).json({ message: `Successfully deleted ${trackingIds.length} shipments and cascade structures.` });
    } catch (error) {
        console.error("Bulk delete routing handling crash:", error.message);
        return res.status(500).json({ error: "Failed executing database batch removal operation.", details: error.message });
    }
};