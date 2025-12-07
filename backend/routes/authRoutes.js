const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validation');

// Login routes
router.post('/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  authController.login
);

router.post('/waiter-login',
  [
    body('pin')
      .notEmpty().withMessage('PIN is required')
      .isLength({ min: 4, max: 6 }).withMessage('PIN must be 4-6 digits')
  ],
  validate,
  authController.waiterLogin
);

router.post('/customer-login',
  authController.customerLogin
);

// Logout
router.post('/logout', authenticate, authController.logout);

// Refresh token
router.post('/refresh',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required')
  ],
  validate,
  authController.refresh
);

// Get current user
router.get('/me', authenticate, authController.me);

// Validate token
router.post('/validate-token', authController.validateToken);

module.exports = router;
