/**
 * Utility to generate JWT token for authenticated users
 * @param {String} userId - MongoDB ObjectId or unique user identifier
 * @returns {String} JWT Token
 */

const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // you can change this duration as needed
  });
};

module.exports = generateToken;
