const crypto = require('crypto');

const generateUniqueAgentId = () => {
  // Generates a random 3-byte hex string (6 characters, e.g., "a1b2c3")
  const randomBits = crypto.randomBytes(3).toString('hex').toUpperCase();
  const year = new Date().getFullYear();
  return `AGT-${year}-${randomBits}`; // Result: AGT-2026-A1B2C3
};

module.exports = { generateUniqueAgentId };