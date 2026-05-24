// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// // ORM Database & Associations setup
// const sequelize = require('./config/database');
// const { applyAssociations } = require('./models/associations');

// // Route Subsystem Modules
// const authRoutes = require('./routes/auth.routes');
// const shipmentRoutes = require('./routes/shipment.routes');
// const adminRoutes = require('./routes/admin.routes');
// const quoteRoutes = require('./routes/quote.routes');

// const app = express();

// // Initialize Middlewares
// app.use(cors());
// app.use(express.json());

// // Initialize ORM Declarations
// applyAssociations();

// // Connect Feature Pipeline Routers
// app.use('/api/auth', authRoutes);
// app.use('/api/shipments', shipmentRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/quotes', quoteRoutes);

// // Server Boot Process
// const PORT = process.env.PORT || 5000;

// sequelize.authenticate()
//     .then(() => {
//         console.log('🔄 Database schema mapped to ORM entities successfully.');
//         app.listen(PORT, () => console.log(`🚀 Server processing on http://localhost:${PORT}`));
//     })
//     .catch(err => {
//         console.error('❌ ORM initialization failure:', err.message);
//         process.exit(1);
//     });


const express = require('express');
const cors = require('cors');
// Points back one level to find the .env file in the root
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); 

// 📂 FIX: Look directly into the local config folder
const sequelize = require('./config/database'); 
const { applyAssociations } = require('./models/associations'); 

// Router paths inside src
const authRoutes = require('./routes/auth.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const adminRoutes = require('./routes/admin.routes');
const quoteRoutes = require('./routes/quote.routes');

const app = express();
app.use(cors());
app.use(express.json());

applyAssociations();

app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quotes', quoteRoutes);
// 🛡️ Production Deployment Security: Disable aggressive browser caching
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
    .then(() => {
        console.log('🔄 Database schema mapped to ORM entities successfully.');
        app.listen(PORT, () => console.log(`🚀 Server processing on http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error('❌ ORM initialization failure:', err.message);
        process.exit(1);
    });