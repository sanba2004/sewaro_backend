// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// require('dotenv').config();
// const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');

// const app = express();
// app.use(cors());
// app.use(express.json()); // Allows the server to read the JSON you send from React

// // 1. Database Connection
// const db = mysql.createPool({
//     host: 'localhost',
//     user: 'root',      // Your MySQL username
//     password: '', // Your MySQL password
//     database: 'universal_logistics'    // The name of the database you created
// }).promise();

// // app.post('/api/shipments/confirm', async (req, res) => {
// //     const { shipment, packages } = req.body;
// //     const connection = await db.getConnection();

// //     try {
// //         await connection.beginTransaction();

// //         // 1. Insert into 'shipment'
// //         await connection.query(
// //             // "INSERT INTO shipment (tracking_id, sender_name, total_weight_str, created_at, status) VALUES (?, ?, ?, ?, ?)",
// //             "INSERT INTO shipment (tracking_id, sender_name, sender_country,sender_state, sender_zipcode,, sender_id_front_url, sender_id_back_url, sender_type, sender_city, sender_address, sender_contact_num, sender_id_type, receiver_name, receiver_contact, receiver_country, receiver_city, receiver_address, total_weight_str, created_at, status,receiver_zip, receiver_landmark, receiver_state, billing_method, billing_total ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)",
// //             [shipment.trackingId, shipment.senderName, shipment.senderCountry,shipment.senderState, shipment.senderZip,shipment.senderIdFront,shipment.senderIdBack,shipment.senderType, shipment.senderCity, 
// //     shipment.senderAddress, shipment.senderContact, shipment.senderIdType, 
// //     shipment.receiverName, shipment.receiverContact, shipment.receiverCountry, shipment.receiverZip,shipment.receiverLandmark,shipment.billingMethod, shipment.billingTotal,
// //     shipment.receiverCity, shipment.receiverAddress, shipment.weight, 
// //     shipment.date, "Confirmed"]
// //         );

// //         // 2. Loop through Packages
// //         for (const pkg of packages) {
// //             await connection.query(
// //                 "INSERT INTO shipment_package (package_id, parent_tracking_id, package_type, package_profile, has_hollow, dimensions_str, cbm_value) VALUES (?, ?, ?, ?, ?, ?, ?)",
// //                 [pkg.packageId, shipment.trackingId, pkg.type, pkg.dims, pkg.cbm, pkg.profile, pkg.hasHollow]
// //             );

// //             // 3. Loop through Items inside this Package
// //             for (const item of pkg.items) {
// //                 await connection.query(
// //                     "INSERT INTO package_item (parent_package_id, item_description, item_weight, item_qty, item_price, hs_code) VALUES (?, ?, ?, ?, ?,?)",
// //                     [pkg.packageId, item.desc, item.weight, item.qty, item.price, item.hsCode]
// //                 );
// //             }
// //         }

// //         await connection.commit();
// //         res.status(200).send({ message: "Shipment saved successfully!" });

// //     } catch (error) {
// //         await connection.rollback();
// //         console.error("Deployment Error:", error);
// //         res.status(500).send({ error: error.message });
// //     } finally {
// //         connection.release();
// //     }
// // });

// //create shipments
// app.post('/api/shipments/confirm', async (req, res) => {
//     const { shipment, packages, userId } = req.body;
//     const connection = await db.getConnection();

//     try {
//         await connection.beginTransaction();

//         // 1. SHIPMENT TABLE (25 Columns, 25 Question Marks)
//         const shipmentQuery = `
//             INSERT INTO shipment (
//                 tracking_id, user_id, sender_name, sender_country, sender_state, sender_zipcode, 
//                 sender_id_front_url, sender_id_back_url, sender_type, sender_city, sender_address, 
//                 sender_contact_num, sender_id_type, receiver_name, receiver_contact, receiver_country, 
//                 receiver_city, receiver_address, receiver_zip, receiver_landmark, receiver_state, 
//                 billing_method, billing_total, total_weight_str, created_at, status
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//         const shipmentValues = [
//             shipment.trackingId, userId, shipment.senderName, shipment.senderCountry, shipment.senderState, shipment.senderZip,
//             shipment.senderIdFront, shipment.senderIdBack, shipment.senderType, shipment.senderCity, shipment.senderAddress,
//             shipment.senderContact, shipment.senderIdType, shipment.receiverName, shipment.receiverContact, shipment.receiverCountry,
//             shipment.receiverCity, shipment.receiverAddress, shipment.receiverZip, shipment.receiverLandmark, shipment.receiverState,
//             shipment.billingMethod, shipment.billingTotal, shipment.weight, shipment.date, "Confirmed"
//         ];

//         await connection.query(shipmentQuery, shipmentValues);

//         // 2. PACKAGES LOOP
//         for (const pkg of packages) {
//             // Note: Aligning your pkg.dims, pkg.cbm etc. to match the column order
//             await connection.query(
//                 "INSERT INTO shipment_package (package_id, parent_tracking_id, package_type, package_profile, has_hollow, dimensions_str, cbm_value) VALUES (?, ?, ?, ?, ?, ?, ?)",
//                 [pkg.packageId, shipment.trackingId, pkg.type, pkg.profile, pkg.hasHollow, pkg.dims, pkg.cbm]
//             );

//             // 3. ITEMS LOOP
//             for (const item of pkg.items) {
//                 await connection.query(
//                     "INSERT INTO package_item (parent_package_id, item_description, item_weight, item_qty, item_price, hs_code) VALUES (?, ?, ?, ?, ?, ?)",
//                     [pkg.packageId, item.desc, item.weight, item.qty, item.price, item.hsCode]
//                 );
//             }
//         }

//         await connection.commit();
//         res.status(200).send({ message: "Shipment saved successfully!" });

//     } catch (error) {
//         await connection.rollback();
//         console.error("MySQL Error:", error.message);
//         res.status(500).send({ error: error.message });
//     } finally {
//         connection.release();
//     }
// });

// // view shipments
// // app.get('/api/shipments/all', async (req, res) => {
// //   try {
   
// //     const query = "SELECT * FROM shipment ORDER BY created_at DESC";
    
// //     const [rows] = await db.query(query);

// //     // Always send an array back to prevent .map() crashes on frontend
// //     res.status(200).json(Array.isArray(rows) ? rows : []);
// //   } catch (error) {
// //     console.error("Fetch Error:", error.message);
// //     // If it fails, send an empty array so the frontend table just shows "No data"
// //     res.status(500).json([]); 
// //   }
// // });
// // view shipments - filtered by role
// // app.get('/api/shipments/all', async (req, res) => {
// //   const { userId, role } = req.query; // Get user details from request query

// //   try {
// //     let query;
// //     let params = [];

// //     if (role?.toLowerCase() === 'admin') {
// //       // Admin sees everything
// //       query = "SELECT * FROM shipment ORDER BY created_at DESC";
// //     } else {
// //       // Agents and Customers only see their own
// //       query = "SELECT * FROM shipment WHERE user_id = ? ORDER BY created_at DESC";
// //       params = [userId];
// //     }
    
// //     const [rows] = await db.query(query, params);
// //     res.status(200).json(Array.isArray(rows) ? rows : []);
// //   } catch (error) {
// //     console.error("Fetch Error:", error.message);
// //     res.status(500).json([]); 
// //   }
// // });
// // app.get('/api/shipments/all', async (req, res) => {
// //   const { userId, role } = req.query; 

// //   // Defensive sanity check: non-admins must supply a valid user identification key
// //   if (role?.toLowerCase() !== 'admin' && !userId) {
// //     return res.status(400).json({ error: "Missing required parameter: userId" });
// //   }

// //   try {
// //     let query;
// //     let params = [];

// //     if (role?.toLowerCase() === 'admin') {
// //       // Admin sees everything globally across the logistics system
// //       query = "SELECT * FROM shipment ORDER BY created_at DESC";
// //     } else {
// //       // FIXED: Force userId into an absolute integer to perfectly line up with your INT columns
// //       query = "SELECT * FROM shipment WHERE user_id = ? ORDER BY created_at DESC";
// //       params = [Number(userId)];
// //     }
    
// //     const [rows] = await db.query(query, params);
    
// //     // Always return an array response back to the client
// //     res.status(200).json(Array.isArray(rows) ? rows : []);
// //   } catch (error) {
// //     console.error("Backend Database Query Failure:", error.message);
    
// //     // IMPROVEMENT: Send a descriptive object instead of an empty array on server crash
// //     // This helps your frontend distinguish between "no shipments found" and an actual server error.
// //     res.status(500).json({ error: "Internal server error reading logistics ledger." }); 
// //   }
// // });
// app.get('/api/shipments/all', async (req, res) => {
//   const { userId, role } = req.query; 
//   const normalizedRole = role?.toLowerCase();

//   // 1. Strict Isolation Enforcement
//   if (normalizedRole !== 'admin') {
//     // Catch nulls, undefined values, and blank parameters sent from the front-end
//     if (!userId || userId === 'undefined' || userId === 'null' || userId === '') {
//       return res.status(400).json({ error: "Access Denied. A valid user identity parameter is required." });
//     }
//   }

//   try {
//     let query;
//     let params = [];

//     // 2. Admin Permissions Query
//     if (normalizedRole === 'admin') {
//       query = "SELECT * FROM shipment ORDER BY created_at DESC";
//     } 
//     // 3. Customer & Agent Isolation Query
//     else if (normalizedRole === 'customer' || normalizedRole === 'agent') {
//       // Maps shipment.user_id foreign key back directly to your verified user primary key table column
//       query = "SELECT * FROM shipment WHERE user_id = ? ORDER BY created_at DESC";
//       params = [Number(userId)];
//     } 
//     // 4. Fallback Safety Guard
//     else {
//       return res.status(403).json({ error: "Invalid context role profile parsing authorization restrictions." });
//     }
    
//     const [rows] = await db.query(query, params);
    
//     // Safety fallback wrapper mapping arrays cleanly back over the wire
//     res.status(200).json(Array.isArray(rows) ? rows : []);
//   } catch (error) {
//     console.error("Backend Database Query Failure:", error.message);
//     res.status(500).json({ error: "Internal server error reading logistics ledger rows." }); 
//   }
// });

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
// app.post('/api/auth/register-customer', async (req, res) => {
//     const { email, password, fullName } = req.body;

//     try {
//         // 1. Check if user already exists
//         const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
//         if (existing.length > 0) {
//             return res.status(400).json({ error: "Email already registered" });
//         }

//         // 2. Hash Password and Generate random 6-digit OTP
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const otp = Math.floor(100000 + Math.random() * 900000).toString(); // <--- GENERATE OTP

//         // 3. Save to Database (Set is_verified to 0 because they need to verify first)
//         // Ensure your 'users' table has an 'otp_code' column!
//         const sql = `INSERT INTO users (full_name, email, password_hash, role, is_verified, otp_code) 
//                      VALUES (?, ?, ?, 'customer', 0, ?)`;
        
//         await db.query(sql, [fullName, email, hashedPassword, otp]);

//         // 4. Send the Email
//         const mailOptions = {
//             from: `"Sewa Logistics" <${process.env.EMAIL_USER}>`,
//             to: email, 
//             subject: 'Verify Your Sewa Logistics Account',
//             html: `<h3>Welcome ${fullName}</h3>
//                    <p>Thank you for joining Sewa Logistics.</p>
//                    <p>Your verification code is: <b style="font-size: 20px; color: #007bff;">${otp}</b></p>
//                    <p>This code will expire shortly.</p>`
//         };

//         await transporter.sendMail(mailOptions);

//         // 5. Return success (Tell the frontend to show the OTP input screen)
//         res.status(200).json({ message: "OTP sent to email. Please verify." });

//     } catch (error) {
//         console.error("Registration Error:", error);
//         res.status(500).json({ error: "Registration failed. Check if email exists or DB is connected." });
//     }
// });

// app.post('/api/auth/verify-otp', async (req, res) => {
//     const { email, otp } = req.body; // Received from your VerifyOTP frontend
//     try {
//         // 1. LOOKUP THE SAVED CODE
//         const [rows] = await db.query("SELECT otp_code FROM users WHERE email = ?", [email]);
        
//         if (rows.length === 0) return res.status(404).json({ error: "User not found" });

//         // 2. COMPARE
//         if (rows[0].otp_code === otp) {
//             // 3. UPDATE DB TO VERIFIED
//             await db.query("UPDATE users SET is_verified = 1, otp_code = NULL WHERE email = ?", [email]);
//             res.status(200).json({ message: "Verified!" });
//         } else {
//             res.status(400).json({ error: "Invalid OTP code" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: "Verification failed" });
//     }
// });
// app.post('/api/auth/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         //  Finding user
//         const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
//         if (rows.length === 0) return res.status(401).json({ error: "User not found" });

//         const user = rows[0];
//         if (user.is_verified === 0) {
//             return res.status(403).json({ error: "Email not verified. Please check your inbox in email for otp." });
//         }
//         // Check Password
//         const isMatch = await bcrypt.compare(password, user.password_hash);
//         if (!isMatch) return res.status(401).json({ error: "Invalid password" });

//         //  if Success - Send back user info 
//         res.status(200).json({ 
//             message: "Login successful",
//             user: { id: user.id, name: user.full_name, role: user.role }
//         });

//     } catch (error) {
//         res.status(500).json({ error: "Login failed" });
//     }
// });


// const PORT = 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });




const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// 1. ORM Imports
const sequelize = require('./config/database');
const User = require('./models/User');
const Shipment = require('./models/Shipment');
const Package = require('./models/Package');
const Item = require('./models/Item');

const app = express();
app.use(cors());
app.use(express.json());

Shipment.hasMany(Package, { foreignKey: 'parent_tracking_id', as: 'packages' });
Package.belongsTo(Shipment, { foreignKey: 'parent_tracking_id' });

Package.hasMany(Item, { foreignKey: 'parent_package_id', as: 'items' });
Item.belongsTo(Package, { foreignKey: 'parent_package_id' });
// --- EMAIL SETUP ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

// --- ROUTE 1: CONFIRM NESTED SHIPMENT (Managed Transaction) ---
app.post('/api/shipments/confirm', async (req, res) => {
    const { shipment, packages } = req.body;
    const userId = req.body.userId || shipment?.userId;
    if (!userId || isNaN(Number(userId))) {
        return res.status(400).json({ error: "Validation Mismatch: A valid numeric user identity is required." });
    }
    // Use an ORM managed transaction to auto-rollback everything if an insert fails
    try {
        await sequelize.transaction(async (t) => {
            
            // A. Insert parent Shipment
            await Shipment.create({
                tracking_id: shipment.trackingId,
                user_id: userId,
                sender_name: shipment.senderName,
                sender_country: shipment.senderCountry,
                sender_state: shipment.senderState,
                sender_zipcode: shipment.senderZip,
                sender_id_front_url: shipment.senderIdFront,
                sender_id_back_url: shipment.senderIdBack,
                sender_type: shipment.senderType,
                sender_city: shipment.senderCity,
                sender_address: shipment.senderAddress,
                sender_contact_num: shipment.senderContact,
                sender_id_type: shipment.senderIdType,
                receiver_name: shipment.receiverName,
                receiver_contact: shipment.receiverContact,
                receiver_country: shipment.receiverCountry,
                receiver_city: shipment.receiverCity,
                receiver_address: shipment.receiverAddress,
                receiver_zip: shipment.receiverZip,
                receiver_landmark: shipment.receiverLandmark,
                receiver_state: shipment.receiverState,
                billing_method: shipment.billingMethod,
                billing_total: shipment.billingTotal,
                total_weight_str: shipment.weight,
                created_at: shipment.date,
                status: "Confirmed"
            }, { transaction: t });

            // B. Populate Packages & Sub-Items
            for (const pkg of packages) {
                await Package.create({
                    package_id: pkg.packageId,
                    parent_tracking_id: shipment.trackingId,
                    package_type: pkg.type,
                    package_profile: pkg.profile,
                    has_hollow: pkg.hasHollow,
                    dimensions_str: pkg.dims,
                    cbm_value: pkg.cbm
                }, { transaction: t });

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

        res.status(200).send({ message: "Shipment saved successfully through ORM!" });
    } catch (error) {
        console.error("Sequelize Transaction Error:", error.message);
        res.status(500).send({ error: error.message });
    }
});

// --- ROUTE 2: VIEW SHIPMENTS (Filtered Isolation Layer) ---
app.get('/api/shipments/all', async (req, res) => {
    const { userId, role } = req.query; 
    const normalizedRole = role?.toLowerCase();

    if (normalizedRole !== 'admin' && (!userId || userId === 'undefined' || userId === 'null')) {
        return res.status(400).json({ error: "Access Denied. Identity parameter missing." });
    }

    try {
        let findOptions = { order: [['created_at', 'DESC']] };

        // If not an admin, filter query parameters seamlessly
        if (normalizedRole !== 'admin') {
            findOptions.where = { user_id: Number(userId) };
        } else if (normalizedRole !== 'admin' && normalizedRole !== 'customer' && normalizedRole !== 'agent') {
            return res.status(403).json({ error: "Invalid identity context profile parameters." });
        }

        const shipments = await Shipment.findAll(findOptions);
        res.status(200).json(shipments);
    } catch (error) {
        console.error("ORM Ledger Fetch Error:", error.message);
        res.status(500).json({ error: "Internal server error parsing data records." });
    }
});

// --- ROUTE 3: REGISTER CUSTOMER ---
app.post('/api/auth/register-customer', async (req, res) => {
    const { email, password, fullName } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await User.create({
            full_name: fullName,
            email,
            password_hash: hashedPassword,
            role: 'customer',
            is_verified: 0,
            otp_code: otp
        });

        const mailOptions = {
            from: `"Sewa Logistics" <${process.env.EMAIL_USER}>`,
            to: email, 
            subject: 'Verify Your Sewa Logistics Account',
            html: `<h3>Welcome ${fullName}</h3>
                   <p>Your verification code is: <b style="font-size: 20px; color: #007bff;">${otp}</b></p>`
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "OTP sent to email. Please verify." });
    } catch (error) {
        console.error("ORM Auth Registration Error:", error);
        res.status(500).json({ error: "Registration failed." });
    }
});

// --- ROUTE 4: VERIFY OTP ---
app.post('/api/auth/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.otp_code === otp) {
            await user.update({ is_verified: 1, otp_code: null });
            res.status(200).json({ message: "Verified!" });
        } else {
            res.status(400).json({ error: "Invalid OTP code" });
        }
    } catch (error) {
        res.status(500).json({ error: "Verification failed" });
    }
});

// --- ROUTE 5: USER LOGIN ---
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ error: "User not found" });

        if (user.is_verified === 0) {
            return res.status(403).json({ error: "Email not verified. Check mailbox." });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: "Invalid password" });

        res.status(200).json({ 
            message: "Login successful",
            user: { 
                id: user.id, 
                name: user.full_name, 
                role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

// --- BOOTSTRAP CONNECTION AND START SERVER ---
const PORT = 5000;
sequelize.authenticate()
    .then(() => {
        console.log('🔄 Database schema mapped to ORM entities successfully.');
        app.listen(PORT, () => console.log(`🚀 Server processing on http://localhost:${PORT}`));
    })
    .catch(err => console.error('❌ ORM initialization failure:', err.message));

