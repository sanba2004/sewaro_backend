

// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');

// // 1. ORM Imports
// const sequelize = require('./config/database');
// const User = require('./models/User');
// const Shipment = require('./models/Shipment');
// const Package = require('./models/Package');
// const Item = require('./models/Item');
// const { Op } = require('sequelize');

// const app = express();
// app.use(cors());
// app.use(express.json());

// Shipment.hasMany(Package, { foreignKey: 'parent_tracking_id', as: 'packages' });
// Package.belongsTo(Shipment, { foreignKey: 'parent_tracking_id' });

// Package.hasMany(Item, { foreignKey: 'parent_package_id', as: 'items' });
// Item.belongsTo(Package, { foreignKey: 'parent_package_id' });
// // --- EMAIL SETUP ---
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, 
//     auth: {
//         user: process.env.EMAIL_USER, 
//         pass: process.env.EMAIL_PASS  
//     }
// });

// // --- ROUTE 1: CONFIRM NESTED SHIPMENT (Managed Transaction) ---
// app.post('/api/shipments/confirm', async (req, res) => {
//     const { shipment, packages } = req.body;
//     const userId = req.body.userId || shipment?.userId;
//     if (!userId || isNaN(Number(userId))) {
//         return res.status(400).json({ error: "Validation Mismatch: A valid numeric user identity is required." });
//     }
//     // Use an ORM managed transaction to auto-rollback everything if an insert fails
//     try {
//         await sequelize.transaction(async (t) => {
            
//             // A. Insert parent Shipment
//             await Shipment.create({
//                 tracking_id: shipment.trackingId,
//                 user_id: userId,
//                 sender_name: shipment.senderName,
//                 sender_country: shipment.senderCountry,
//                 sender_state: shipment.senderState,
//                 sender_zipcode: shipment.senderZip,
//                 sender_id_front_url: shipment.senderIdFront,
//                 receiver_id_url: shipment.receiverIdUrl,
//                 sender_type: shipment.senderType,
//                 sender_city: shipment.senderCity,
//                 sender_address: shipment.senderAddress,
//                 sender_contact_num: shipment.senderContact,
//                 sender_id_type: shipment.senderIdType,
//                 receiver_name: shipment.receiverName,
//                 receiver_contact: shipment.receiverContact,
//                 receiver_country: shipment.receiverCountry,
//                 receiver_city: shipment.receiverCity,
//                 receiver_address: shipment.receiverAddress,
//                 receiver_zip: shipment.receiverZip,
//                 receiver_landmark: shipment.receiverLandmark,
//                 receiver_state: shipment.receiverState,
//                 billing_method: shipment.billingMethod,
//                 billing_total: shipment.billingTotal,
//                 total_weight_str: shipment.weight,
//                 created_at: shipment.date,
//                 status: "Confirmed"
//             }, { transaction: t });

//             // B. Populate Packages & Sub-Items
//             for (const pkg of packages) {
//                 await Package.create({
//                     package_id: pkg.packageId,
//                     parent_tracking_id: shipment.trackingId,
//                     package_type: pkg.type,
//                     package_profile: pkg.profile,
//                     has_hollow: pkg.hasHollow,
//                     dimensions_str: pkg.dims,
//                     cbm_value: pkg.cbm
//                 }, { transaction: t });

//                 for (const item of pkg.items) {
//                     await Item.create({
//                         parent_package_id: pkg.packageId,
//                         item_description: item.desc,
//                         item_weight: item.weight,
//                         item_qty: item.qty,
//                         item_price: item.price,
//                         hs_code: item.hsCode
//                     }, { transaction: t });
//                 }
//             }
//         });

//         res.status(200).send({ message: "Shipment saved successfully through ORM!" });
//     } catch (error) {
//         console.error("Sequelize Transaction Error:", error.message);
//         res.status(500).send({ error: error.message });
//     }
// });




// --- ROUTE 2: VIEW SHIPMENTS (With Filters and Pagination) ---
// app.get('/api/shipments/all', async (req, res) => {
//     const { userId, role, dateFrom, dateTo, status, agentId, page, limit } = req.query; 
//     const normalizedRole = role?.toLowerCase();

//     if (normalizedRole !== 'admin' && (!userId || userId === 'undefined' || userId === 'null')) {
//         return res.status(400).json({ error: "Access Denied. Identity parameter missing." });
//     }

//     try {
//         let findOptions = { 
//             where: {},
//             order: [['created_at', 'DESC']] 
//         };

//         // --- A. Role Isolation Logic ---
//         if (normalizedRole !== 'admin') {
//             findOptions.where.user_id = Number(userId);
//         }

//         // --- B. Filters (Date, Status, Agent) ---
//         if (dateFrom || dateTo) {
//             findOptions.where.created_at = {};
//             if (dateFrom) findOptions.where.created_at[Op.gte] = new Date(`${dateFrom}T00:00:00.000Z`);
//             if (dateTo) findOptions.where.created_at[Op.lte] = new Date(`${dateTo}T23:59:59.999Z`);
//         }
//         if (status && status !== 'All') findOptions.where.status = status;
//         if (normalizedRole === 'admin' && agentId && agentId !== 'All') findOptions.where.user_id = Number(agentId);

//         // --- C. PAGINATION MATH ---
//         const activePage = parseInt(page) || 1;
//         const activeLimit = parseInt(limit) || 50; // Defaulting to 50 items per page like Gmail
        
//         findOptions.limit = activeLimit;
//         findOptions.offset = (activePage - 1) * activeLimit;

//         // Use findAndCountAll to get both the rows and the total count
//         const { count, rows } = await Shipment.findAndCountAll(findOptions);
        
//         res.status(200).json({
//             totalItems: count,
//             totalPages: Math.ceil(count / activeLimit),
//             currentPage: activePage,
//             itemsPerPage: activeLimit,
//             shipments: rows
//         });
//     } catch (error) {
//         console.error("ORM Ledger Fetch Error:", error.message);
//         res.status(500).json({ error: "Internal server error parsing data records." });
//     }
// });

// --- ROUTE 2: VIEW SHIPMENTS (With Filters and Pagination) ---
// app.get('/api/shipments/all', async (req, res) => {
//     const { userId, role, dateFrom, dateTo, status, agentId, page, limit } = req.query; 
//     const normalizedRole = role?.toLowerCase();

//     // 🛡️ 1. Bulletproof Identity Check (Safely parse to integer)
//     const safeUserId = parseInt(userId, 10);
    
//     if (normalizedRole !== 'admin' && isNaN(safeUserId)) {
//         return res.status(400).json({ error: "Access Denied. A valid numeric identity parameter is required." });
//     }

//     try {
//         let findOptions = { 
//             where: {},
//             order: [['created_at', 'DESC']] 
//         };

//         // --- A. Role Isolation Logic ---
//         if (normalizedRole !== 'admin') {
//             findOptions.where.user_id = safeUserId;
//         }

//         // --- B. Filters (Date, Status, Agent) ---
//         if (dateFrom || dateTo) {
//             findOptions.where.created_at = {};
//             if (dateFrom) findOptions.where.created_at[Op.gte] = new Date(`${dateFrom}T00:00:00.000Z`);
//             if (dateTo) findOptions.where.created_at[Op.lte] = new Date(`${dateTo}T23:59:59.999Z`);
//         }
        
//         if (status && status !== 'All') {
//             findOptions.where.status = status;
//         }
        
//         // 🛡️ 2. Bulletproof Agent ID Check
//         if (normalizedRole === 'admin' && agentId && agentId !== 'All') {
//             const safeAgentId = parseInt(agentId, 10);
//             if (!isNaN(safeAgentId)) {
//                 findOptions.where.user_id = safeAgentId;
//             }
//         }

//         // --- C. PAGINATION MATH ---
//         // Ensure radix 10 is passed to parseInt for strict base-10 calculation
//         const activePage = parseInt(page, 10) || 1;
//         const activeLimit = parseInt(limit, 10) || 50; 
        
//         findOptions.limit = activeLimit;
//         findOptions.offset = (activePage - 1) * activeLimit;

//         // Use findAndCountAll to get both the rows and the total count
//         const { count, rows } = await Shipment.findAndCountAll(findOptions);
        
//         res.status(200).json({
//             totalItems: count,
//             totalPages: Math.ceil(count / activeLimit),
//             currentPage: activePage,
//             itemsPerPage: activeLimit,
//             shipments: rows
//         });
//     } catch (error) {
//         console.error("ORM Ledger Fetch Error:", error.message);
//         res.status(500).json({ error: "Internal server error parsing data records." });
//     }
// });



// Add this global map right above your routes
// const temporaryRegistrations = new Map();

// --- ROUTE 3: REGISTER CUSTOMER (PENDING VERIFICATION) ---
// app.post('/api/auth/register-customer', async (req, res) => {
//     const { email, password, fullName } = req.body;

//     try {
//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) return res.status(400).json({ error: "Email already registered" });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();

//         // 🌟 SAVE TO MEMORY MAP INSTEAD OF DATABASE
//         temporaryRegistrations.set(email.toLowerCase(), {
//             fullName,
//             password_hash: hashedPassword,
//             otp_code: otp
//         });

//         const mailOptions = {
//             from: `"Sewa Logistics" <${process.env.EMAIL_USER}>`,
//             to: email, 
//             subject: 'Verify Your Sewa Logistics Account',
//             html: `<h3>Welcome ${fullName}</h3>
//                    <p>Your verification code is: <b style="font-size: 20px; color: #007bff;">${otp}</b></p>`
//         };
//         await transporter.sendMail(mailOptions);

//         res.status(200).json({ message: "OTP sent to email. Please verify." });
//     } catch (error) {
//         console.error("ORM Auth Registration Error:", error);
//         res.status(500).json({ error: "Registration failed." });
//     }
// });

// --- ROUTE 4: VERIFY OTP ---
// app.post('/api/auth/verify-otp', async (req, res) => {
//     const { email, otp } = req.body;
//     const normalizedEmail = email.toLowerCase();

//     try {
//         // 🌟 FETCH FROM MEMORY MAP
//         const pendingUser = temporaryRegistrations.get(normalizedEmail);
//         if (!pendingUser) return res.status(444).json({ error: "Registration session expired. Please register again." });

//         if (pendingUser.otp_code === otp) {
//             // 🌟 FINALLY WRITE TO MYSQL NOW THAT OTP IS VALID
//             await User.create({
//                 full_name: pendingUser.fullName,
//                 email: normalizedEmail,
//                 password_hash: pendingUser.password_hash,
//                 role: 'customer',
//                 is_verified: 1,
//                 otp_code: null
//             });

//             // Clean up the memory map
//             temporaryRegistrations.delete(normalizedEmail);

//             res.status(200).json({ message: "Verified and registered!" });
//         } else {
//             res.status(400).json({ error: "Invalid OTP code" });
//         }
//     } catch (error) {
//         console.error("Verification DB Error:", error);
//         res.status(500).json({ error: "Verification failed" });
//     }
// });


// --- ROUTE 5: USER LOGIN ---
// app.post('/api/auth/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ where: { email } });
//         if (!user) return res.status(401).json({ error: "User not found" });

//         if (user.is_verified === 0) {
//             return res.status(403).json({ error: "Email not verified. Check mailbox." });
//         }

//         const isMatch = await bcrypt.compare(password, user.password_hash);
//         if (!isMatch) return res.status(401).json({ error: "Invalid password" });

//         res.status(200).json({ 
//             message: "Login successful",
//             user: { 
//                 id: user.id, 
//                 name: user.full_name, 
//                 role: user.role }
//         });
//     } catch (error) {
//         res.status(500).json({ error: "Login failed" });
//     }
// });

// const {generateUniqueAgentId}= require('./utils/generateId');

// app.get('/api/admin/agents', async (req, res) => {
//   try {
//     const agents = await User.findAll({
//       where: { role: 'agent' },
//       attributes: ['id', 'full_name', 'email', 'agent_id', 'is_verified', 'created_at'],
//       order: [['created_at', 'DESC']]
//     });
//     return res.status(200).json(agents);
//   } catch (error) {
//     console.error('Error fetching agents:', error);
//     return res.status(500).json({ error: 'Internal server error fetching agents' });
//   }
// });
// 2. POST: Admin creates a pre-verified agent bypassing OTP
// app.post('/api/admin/agents/create', async (req, res) => {
//   try {
//     const { full_name, email, password } = req.body;

//     if (!full_name || !email || !password) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email is already registered' });
//     }

//     const saltRounds = 10;
//     const password_hash = await bcrypt.hash(password, saltRounds);

//     let agent_id = generateUniqueAgentId();
//     let isUnique = false;

//     while (!isUnique) {
//       const collisionCheck = await User.findOne({ where: { agent_id } });
//       if (!collisionCheck) {
//         isUnique = true;
//       } else {
//         agent_id = generateUniqueAgentId(); 
//       }
//     }

//     const newAgent = await User.create({
//       full_name,
//       email,
//       password_hash,
//       role: 'agent',
//       agent_id,
//       otp_code: null,      
//       otp_expiry: null,    
//       is_verified: true,   
//       created_at: new Date()
//     });

//     return res.status(201).json({
//       message: 'Agent created successfully!',
//       agent: {
//         id: newAgent.id,
//         full_name: newAgent.full_name,
//         email: newAgent.email,
//         agent_id: newAgent.agent_id
//       }
//     });

//   } catch (error) {
//     console.error('Error establishing agent account:', error);
//     return res.status(500).json({ error: 'Database transaction error creating agent' });
//   }
// });

// app.get('/api/shipments/track/:trackingId', async (req, res) => {
//     const { trackingId } = req.params;

//     try {
//         console.log(`📡 Querying database for Tracking ID: ${trackingId}`);

//         const shipmentData = await Shipment.findOne({
//             where: { tracking_id: trackingId }, // ⚠️ Check if your Shipment model uses tracking_id or trackingId!
//             include: [
//                 {
//                     model: Package,
//                     as: 'packages', 
//                     required: false,
//                     include: [
//                         {
//                             model: Item,
//                             as: 'items',
//                             required: false
//                         }
//                     ]
//                 }
//             ]
//         });

//         if (!shipmentData) {
//             console.log(`❌ Shipment ${trackingId} not found.`);
//             return res.status(404).json({ message: `Shipment record for ID ${trackingId} was not found.` });
//         }

//         // Format the database data safely to send to the frontend matching its expectations
//         const formattedResponse = {
//             tracking_id: shipmentData.tracking_id || shipmentData.trackingId,
//             user_id: shipmentData.user_id || shipmentData.userId,
//             shipper_name: shipmentData.sender_name || shipmentData.senderName,
//             shipper_city: shipmentData.sender_city || shipmentData.senderCity,
//             sender_id_front_url: shipmentData.sender_id_front_url || 
//                          shipmentData.senderIdFrontUrl || 
//                          shipmentData.senderIdFront || 
//                          shipmentData.getDataValue?.('sender_id_front_url'),
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
//         console.error("❌ Backend Sequelize Error:", error);
//         return res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
// });


// // --- ROUTE 3: LIVE RE-BALANCING OF TRACKING LIFE-CYCLE STATUS ---
// app.put('/api/shipments/status', async (req, res) => {
//     const { trackingId, status } = req.body;

//     if (!trackingId || !status) {
//         return res.status(400).json({ error: "Required payload parameters trackingId or status state properties are absent." });
//     }

//     try {
//         // Look up target entry row mapping directly inside model definition schemas
//         const shipment = await Shipment.findOne({ where: { tracking_id: trackingId } });

//         if (!shipment) {
//             return res.status(404).json({ error: `No active records matched tracking token: ${trackingId}` });
//         }

//         // Apply new status value mutation strings
//         shipment.status = status;
//         await shipment.save();

//         console.log(`🎯 [DB UPDATE SUCCESS] Shipment #${trackingId} shifted to status state string: "${status}"`);
//         return res.status(200).json({ message: "Logistics status state successfully saved to disk arrays.", status });

//     } catch (error) {
//         console.error("❌ Status Mutation Sequelize Framework Failure:", error);
//         return res.status(500).json({ error: "Internal operational update engine fault.", details: error.message });
//     }
// });





// // --- ROUTE 2: ADMIN EDIT/REPLACE SHIPMENT DETAILS (Managed Transaction) ---
// app.put('/api/shipments/update/:trackingId', async (req, res) => {
//     const { trackingId } = req.params;
//     const data = req.body;

//     if (!trackingId || !data) {
//         return res.status(400).json({ error: "Validation Mismatch: Missing tracking ID or update payload data." });
//     }

//     try {
//         // Run updates inside a secure database transaction block
//         await sequelize.transaction(async (t) => {
            
//             // 1. Verify parent record existence safely first
//             const existingShipment = await Shipment.findOne({
//                 where: { tracking_id: trackingId },
//                 transaction: t
//             });

//             if (!existingShipment) {
//                 throw new Error(`Target shipment with tracking number #${trackingId} not found.`);
//             }

//             // 2. Update Parent Shipment Record (Including Status)
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
//             }, {
//                 where: { tracking_id: trackingId },
//                 transaction: t
//             });

//             // 3. Loop Through and Update Nested Packages & Sub-Items
//             if (data.shipment_package && Array.isArray(data.shipment_package)) {
//                 for (const pkg of data.shipment_package) {
                    
//                     const currentPackageId = pkg.package_id || pkg.id;

//                     // ✨ FIXED: Added all missing package schema dimensions & metrics mappings
//                     await Package.update({
//                         package_type: pkg.type,
//                         package_profile: pkg.profile,
//                         has_hollow: pkg.hasHollow,
//                         dimensions_str: pkg.dims || pkg.dimensions_str,
//                         cbm_value: String(pkg.cbm) 
//                     }, {
//                         where: { 
//                             package_id: currentPackageId,
//                             parent_tracking_id: trackingId 
//                         },
//                         transaction: t
//                     });

//                     // 4. Update nested items inside this explicit package layer
//                     if (pkg.shipment_item && Array.isArray(pkg.shipment_item)) {
//                         for (const item of pkg.shipment_item) {
                            
//                             // Fallback to match either tracking payload schema configurations smoothly
//                             const currentItemId = item.item_id || item.id;

//                             await Item.update({
//                                 item_description: item.description,
//                                 item_qty: item.qty,
//                                 item_weight: String(item.weight),
//                                 item_price: item.price,
//                                 hs_code: item.hs_code || item.hsCode
//                             }, {
//                                 where: { 
//                                     // Looks for tracking table index directly matching database schemas
//                                     id: currentItemId, 
//                                     parent_package_id: currentPackageId
//                                 },
//                                 transaction: t
//                             });
//                         }
//                     }
//                 }
//             }
//         });

//         console.log(`🎯 [DB UPDATE SUCCESS] Shipment, Packages, and Items for #${trackingId} updated successfully.`);
//         return res.status(200).json({ message: `Shipment #${trackingId} records successfully replaced in database!` });

//     } catch (error) {
//         console.error("❌ Sequelize Update Transaction Error:", error);
//         return res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
// });



// // --- ROUTE 5: DISPATCH QUOTE REQUEST VIA EMAIL ---
// app.post('/api/quotes/request', async (req, res) => {
//     const { senderCountry, receiverCountry, weight, description, deliveryType, contactInfo } = req.body;

//     // Validation guard to make sure required fields exist
//     if (!senderCountry || !receiverCountry || !weight || !description || !contactInfo) {
//         return res.status(400).json({ error: "Missing required fields in submission." });
//     }

//     const mailLayoutOptions = {
//         from: `"Sewa Quotes Desk" <${process.env.EMAIL_USER}>`,
//         to: 'redsanba@gmail.com', //  email where you want to receive the quotes
//         subject: `🚨 New Quote Request Alert: [${deliveryType.toUpperCase()} Handling]`,
//         html: `
//           <div style="font-family: sans-serif; padding: 20px; color: #1a2530; max-width: 600px; border: 1px solid #eceff0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
//             <h2 style="color: #0250a3; border-bottom: 2px solid #0250a3; padding-bottom: 10px; margin-top: 0;">New Shipment Valuation Request</h2>
//             <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
//               <tr>
//                 <td style="padding: 6px 0; font-weight: bold; color: #566573;">Route:</td>
//                 <td style="padding: 6px 0; color: #0f1c2a;">From ${senderCountry} to ${receiverCountry}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 6px 0; font-weight: bold; color: #566573;">Mass Weight:</td>
//                 <td style="padding: 6px 0; color: #0f1c2a;">${weight} kg</td>
//               </tr>
//               <tr>
//                 <td style="padding: 6px 0; font-weight: bold; color: #566573;">Service Type:</td>
//                 <td style="padding: 6px 0; color: #0f1c2a;">
//                   ${deliveryType === 'special' ? '<span style="color: #c53030; font-weight: bold;">🔴 Special Service (Meat / Medicine)</span>' : '🔵 Standard Service Handling'}
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding: 6px 0; font-weight: bold; color: #566573;">Client Contact:</td>
//                 <td style="padding: 6px 0; color: #0056b3; font-weight: bold;">${contactInfo}</td>
//               </tr>
//             </table>
            
//             <div style="background: #f7f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #0250a3;">
//               <h4 style="margin: 0 0 8px 0; color: #0f1c2a;">Cargo Inventory Description:</h4>
//               <p style="margin: 0; line-height: 1.6; color: #566573; font-size: 14px;">${description}</p>
//             </div>
//           </div>
//         `
//     };

//     try {
//         await transporter.sendMail(mailLayoutOptions);
//         res.status(200).json({ success: true, message: "Quote request successfully transmitted!" });
//     } catch (emailProcessingError) {
//         console.error("Quotes System Email Error:", emailProcessingError);
//         res.status(500).json({ error: "Failed to process and forward quote metrics via mail system." });
//     }
// });














// // --- BOOTSTRAP CONNECTION AND START SERVER ---
// const PORT = 5000;
// //const PORT = process.env.PORT || 5000;
// sequelize.authenticate()
//     .then(() => {
//         console.log('🔄 Database schema mapped to ORM entities successfully.');
//         app.listen(PORT, () => console.log(`🚀 Server processing on http://localhost:${PORT}`));
//     })
//     .catch(err => console.error('❌ ORM initialization failure:', err.message));

