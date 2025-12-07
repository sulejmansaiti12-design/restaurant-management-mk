const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn, jwtRefreshExpiresIn } = require('../config/auth');

class JWTService {
  generateAccessToken(payload) {
    return jwt.sign(payload, jwtSecret, {
      expiresIn: jwtExpiresIn
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, jwtSecret, {
      expiresIn: jwtRefreshExpiresIn
    });
  }

  generateTokens(id, role, additionalData = {}) {
    const payload = { id, role, ...additionalData };
    
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, jwtSecret);
    } catch (error) {
      throw error;
    }
  }

  decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = new JWTService();
