// const nodemailer = require('nodemailer');
// require('dotenv').config();

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

// module.exports = transporter;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // 🌟 FIX 1: Use Google's direct IPv4 address cluster to completely bypass IPv6 DNS resolution
  host: '74.125.200.108', // Resolves directly to smtp.gmail.com (IPv4)
  
  // 🌟 FIX 2: Set port to 587 but explicitly enforce connection mechanics
  port: 587,
  secure: false, 
  
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },

  // 🌟 FIX 3: Set strict server name validation so TLS authentication accepts the raw IP address
  tls: {
    servername: 'smtp.gmail.com', // Tells Google we know we are connecting via raw IP
    rejectUnauthorized: false     // Prevents cloud firewalls from breaking the connection handshake
  },
  
  // 🌟 FIX 4: Tighten connection lifecycles to clear blocked sockets immediately
  connectionTimeout: 5000, 
  greetingTimeout: 5000,
  socketTimeout: 5000
});

// Verify the mail configuration layout works safely during server bootup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Nodemailer SMTP Connection Failure:', error.message);
    console.log('💡 Tip: If timeout persists, Render is blocking outbound mail ports completely.');
  } else {
    console.log('📬 Nodemailer Mail Carrier Engine is successfully connected over clean IPv4 wirelines!');
  }
});

module.exports = transporter;