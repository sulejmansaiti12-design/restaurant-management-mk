const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');
const db = require('../models');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);

    // Check if user/waiter exists
    if (decoded.role === 'waiter') {
      const waiter = await db.Waiter.findByPk(decoded.id);
      if (!waiter || !waiter.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token or waiter inactive'
        });
      }
      req.user = waiter;
      req.user.role = 'waiter';
    } else if (decoded.role === 'customer') {
      const customer = await db.Customer.findByPk(decoded.id);
      if (!customer) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      req.user = customer;
      req.user.role = 'customer';
    } else {
      const user = await db.User.findByPk(decoded.id);
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token or user inactive'
        });
      }
      req.user = user;
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

module.exports = authenticate;
