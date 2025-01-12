// backend/middleware/tokenService.js
const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for a user.
 * @param {Object} payload - The payload to encode in the token (e.g., userId, permissions).
 * @param {string} [secret=process.env.JWT_SECRET] - The secret key for signing the token.
 * @param {string} [expiresIn='1h'] - Token expiration time.
 * @returns {string} - The signed JWT token.
 */
const generateToken = (payload, secret = process.env.JWT_SECRET, expiresIn = '1h') => {
  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = {
  generateToken,
};
