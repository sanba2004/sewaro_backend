

// const express = require('express');
// const cors = require('cors');
// // Points back one level to find the .env file in the root
// require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); 

// // 📂 FIX: Look directly into the local config folder
// const sequelize = require('./config/database'); 
// const { applyAssociations } = require('./models/associations'); 

// // Router paths inside src
// const authRoutes = require('./routes/auth.routes');
// const shipmentRoutes = require('./routes/shipment.routes');
// const adminRoutes = require('./routes/admin.routes');
// const quoteRoutes = require('./routes/quote.routes');
// const pricingRoutes = require('./routes/pricing.routes');

// const app = express();
// app.use(cors());
// app.use(express.json());

// applyAssociations();

// app.use('/api/auth', authRoutes);
// app.use('/api/shipments', shipmentRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/quotes', quoteRoutes);
// app.use('/api/pricing', pricingRoutes);

// // 🛡️ Production Deployment Security: Disable aggressive browser caching
// app.use((req, res, next) => {
//   res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//   res.setHeader('Pragma', 'no-cache');
//   res.setHeader('Expires', '0');
//   res.setHeader('Surrogate-Control', 'no-store');
//   next();
// });

// app.use(cors({
//   origin: [
//     'https://sewaro-frontend.vercel.app', // Your production frontend                // Create React App local development port
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));
// // const PORT = process.env.PORT || 5000;

// // sequelize.authenticate()
// //     .then(() => {
// //         console.log('🔄 Database schema mapped to ORM entities successfully.');
// //         app.listen(PORT, () => console.log(`🚀 Server processing on http://localhost:${PORT}`));
// //     })
// //     .catch(err => {
// //         console.error('❌ ORM initialization failure:', err.message);
// //         process.exit(1);
// //     });
// // Find this section at the bottom of your src/server.js file:
// const PORT = process.env.PORT || 5000;

// sequelize.authenticate()
//     .then(async () => {
//         console.log('🔗 Successfully authenticated with Aiven Cloud Database.');
        
//         // 🏗️ Force sync all structural models to automatically build any missing tables
//         console.log('🏗️ Synchronizing ORM schemas with database ledger instances...');
//         await sequelize.sync({ alter: true }); 
//         console.log('🔄 Database schema mapped to ORM entities successfully.');

//         // Start processing requests only after the structural syncing has finished safely
//         app.listen(PORT, () => console.log(`🚀 Server processing on http://localhost:${PORT}`));
//     })
//     .catch(err => {
//         console.error('❌ ORM initialization failure:', err.message);
//         process.exit(1);
//     });
// //const PricingTier = require('./models/PricingTier');

// // sequelize.authenticate()
// //     .then(async () => {
// //         console.log('🔗 Successfully authenticated with Aiven Cloud Database.');
// //         await sequelize.sync({ alter: true }); 
        
// //         // 🌱 Seed initial database rates if the table is completely empty
// //         const count = await PricingTier.count();
// //         if (count === 0) {
// //             await PricingTier.bulkCreate([
// //                 { tier_name: 'Small Shipments', max_weight: 5.0, rate_per_kg: 1200 },
// //                 { tier_name: 'Medium Scale', max_weight: 20.0, rate_per_kg: 950 },
// //                 { tier_name: 'Bulk Rate Discount', max_weight: 100.0, rate_per_kg: 750 },
// //                 { tier_name: 'Commercial Scale', max_weight: 999999.0, rate_per_kg: 600 } // fallback ceiling
// //             ]);
// //             console.log('🌱 Seeded default pricing tiers into Aiven Cloud Database!');
// //         }

// //         console.log('🔄 Database schema mapped to ORM entities successfully.');
// //         app.listen(PORT, () => console.log(`🚀 Server processing on http://localhost:${PORT}`));
// //     });
// // sequelize.authenticate()
// //     .then(async () => {
// //         console.log('🔗 Successfully authenticated with Aiven Cloud Database.');
// //         await sequelize.sync({ alter: true }); 
        
// //         // 🌱 Seed initial database rates with complete min/max range attributes
// //         const count = await PricingTier.count();
// //         if (count === 0) {
// //             await PricingTier.bulkCreate([
// //                 { tier_name: 'Light Weight Scale', min_weight: 0.0,  max_weight: 9.49,   rate_per_kg: 590 },
// //                 { tier_name: 'Medium Scale',       min_weight: 9.5,  max_weight: 19.49,  rate_per_kg: 500 },
// //                 { tier_name: 'Standard Bulk',      min_weight: 19.5, max_weight: 49.99,  rate_per_kg: 478 },
// //                 { tier_name: 'Heavy Bulk',         min_weight: 50.0, max_weight: 99.99,  rate_per_kg: 478 },
// //                 { tier_name: 'Commercial Freight', min_weight: 100.0, max_weight: 500.00, rate_per_kg: 445 },
// //                 { tier_name: 'Overweight Ceiling', min_weight: 500.01, max_weight: 99999.0, rate_per_kg: 445 } // safety gap filler
// //             ]);
// //             console.log('🌱 Seeded default range-based pricing tiers into database!');
// //         }

// //         console.log('🔄 Database schema mapped to ORM entities successfully.');
// //         app.listen(PORT, () => console.log(`🚀 Server processing on http://localhost:${PORT}`));
// //     });


const express = require('express');
const cors = require('cors');
// Points back one level to find the .env file in the root
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); 

// 📂 Look directly into the local config folder
const sequelize = require('./config/database'); 
const { applyAssociations } = require('./models/associations'); 

// Router paths inside src
const authRoutes = require('./routes/auth.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const adminRoutes = require('./routes/admin.routes');
const quoteRoutes = require('./routes/quote.routes');
const pricingRoutes = require('./routes/pricing.routes');

const app = express();

// ✨ FIX 1: Apply the correct production CORS policy at the very top
app.use(cors({
  origin: [
    'https://sewaro-frontend.vercel.app', 
    'http://localhost:5173', // Include local development paths if needed
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// ✨ FIX 2: Security headers should run right away before routes execute
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

applyAssociations();

// ✨ FIX 3: Routes now process requests with all security/CORS wrappers active
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/pricing', pricingRoutes);

// Database connection and app listener section
const PORT = process.env.PORT || 5000;

// sequelize.authenticate()
//     .then(async () => {
//         console.log('🔗 Successfully authenticated with Aiven Cloud Database.');
        
//         console.log('🏗️ Synchronizing ORM schemas with database ledger instances...');
//         await sequelize.sync(); 
//         console.log('🔄 Database schema mapped to ORM entities successfully.');

//         app.listen(PORT, () => console.log(`🚀 Server processing on http://localhost:${PORT}`));
//     })
//     .catch(err => {
//         console.error('❌ ORM initialization failure:', err.message);
//         process.exit(1);
//     });
const PORT = process.env.PORT || 5000;
const bcrypt = require('bcrypt'); // Make sure this is installed and imported

sequelize.authenticate()
    .then(async () => {
        console.log('🔗 Successfully authenticated with Aiven Cloud Database.');
        
        // 🧼 1. Rebuild tables fresh to permanently clear out the 64-key blockages
        console.log('💥 FORCE RESET: Dropping bloated tables and rebuilding fresh schemas...');
        await sequelize.sync({ force: true }); 
        console.log('✨ Database structural layout reset successfully!');

        // 🌱 2. AUTOMATICALLY SEED ADMINISTRATOR WITH SECURE CRYPTO BCRYPT HASH
        try {
            console.log('🌱 Seeding default administrator account...');
            
            // Generate a real production-grade hash so your login controllers work perfectly
            const secureAdminHash = await bcrypt.hash('YourSecurePassword123', 10); // 👈 Put your desired admin password here
            
            await sequelize.models.User.create({
                full_name: 'System Administrator',
                email: 'sewaro151@gmail.com',         // 👈 Your admin login email
                password_hash: secureAdminHash,        // ✨ Passes a valid hash safely!
                role: 'admin',                         // Grants master dashboard privileges
                is_verified: 1                         // Pre-verifies admin so you don't need an OTP to log in
            });

            console.log('🚀 Admin account injected successfully into clean tables!');
        } catch (seedError) {
            console.error('⚠️ Admin seeding skipped or failed:', seedError.message);
        }

        // Start processing requests on Render
        app.listen(PORT, () => console.log(`🚀 Server processing on http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error('❌ ORM initialization failure:', err.message);
        process.exit(1);
    });