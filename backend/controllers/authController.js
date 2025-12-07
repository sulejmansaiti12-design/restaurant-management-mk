const db = require('../models');
const jwtService = require('../services/jwtService');
const { roles } = require('../config/auth');

class AuthController {
  /**
   * Login for Owner, Admin, Developer, Customer
   */
  async login(req, res, next) {
    try {
      const { username, password, role } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      // Find user
      const user = await db.User.findOne({ where: { username } });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Validate password
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account is inactive'
        });
      }

      // Generate tokens
      const { accessToken, refreshToken } = jwtService.generateTokens(user.id, user.role);

      // Update user
      await user.update({
        lastLogin: new Date(),
        refreshToken
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: user.toJSON(),
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login for Waiters using PIN
   */
  async waiterLogin(req, res, next) {
    try {
      const { pin } = req.body;

      if (!pin) {
        return res.status(400).json({
          success: false,
          message: 'PIN is required'
        });
      }

      // Find all active waiters (we need to check PIN against all)
      const waiters = await db.Waiter.findAll({
        where: { isActive: true },
        include: [{ model: db.Zone, as: 'zone' }]
      });

      let authenticatedWaiter = null;

      // Check PIN against each waiter
      for (const waiter of waiters) {
        const isValidPin = await waiter.validatePin(pin);
        if (isValidPin) {
          authenticatedWaiter = waiter;
          break;
        }
      }

      if (!authenticatedWaiter) {
        return res.status(401).json({
          success: false,
          message: 'Invalid PIN'
        });
      }

      // Generate tokens
      const { accessToken, refreshToken } = jwtService.generateTokens(
        authenticatedWaiter.id,
        'waiter'
      );

      // Update waiter
      await authenticatedWaiter.update({
        lastLogin: new Date(),
        refreshToken
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          waiter: authenticatedWaiter.toJSON(),
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login for Customers using table ID
   */
  async customerLogin(req, res, next) {
    try {
      const { tableId, tableNumber } = req.body;

      if (!tableId && !tableNumber) {
        return res.status(400).json({
          success: false,
          message: 'Table ID or table number is required'
        });
      }

      // Find table
      const whereClause = tableId ? { id: tableId } : { tableNumber };
      const table = await db.Table.findOne({ where: whereClause });

      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Table not found'
        });
      }

      if (!table.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Table is not available'
        });
      }

      // Create or find customer
      let customer = await db.Customer.findOne({
        where: { tableId: table.id },
        order: [['lastActive', 'DESC']]
      });

      if (!customer) {
        customer = await db.Customer.create({
          tableId: table.id,
          isAnonymous: true,
          lastActive: new Date()
        });
      } else {
        await customer.update({ lastActive: new Date() });
      }

      // Generate tokens
      const { accessToken, refreshToken } = jwtService.generateTokens(
        customer.id,
        'customer',
        { tableId: table.id }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          customer: customer.toJSON(),
          table: table.toJSON(),
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout
   */
  async logout(req, res, next) {
    try {
      const user = req.user;

      // Clear refresh token
      if (user.role === 'waiter') {
        await db.Waiter.update(
          { refreshToken: null },
          { where: { id: user.id } }
        );
      } else if (user.role !== 'customer') {
        await db.User.update(
          { refreshToken: null },
          { where: { id: user.id } }
        );
      }

      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   */
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

      // Verify refresh token
      const decoded = jwtService.verifyToken(refreshToken);

      // Find user/waiter
      let entity;
      if (decoded.role === 'waiter') {
        entity = await db.Waiter.findByPk(decoded.id);
      } else if (decoded.role === 'customer') {
        entity = await db.Customer.findByPk(decoded.id);
      } else {
        entity = await db.User.findByPk(decoded.id);
      }

      if (!entity || entity.refreshToken !== refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      // Generate new tokens
      const tokens = jwtService.generateTokens(entity.id, decoded.role);

      // Update refresh token
      await entity.update({ refreshToken: tokens.refreshToken });

      res.json({
        success: true,
        message: 'Token refreshed',
        data: tokens
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Refresh token expired. Please login again.'
        });
      }
      next(error);
    }
  }

  /**
   * Get current user profile
   */
  async me(req, res, next) {
    try {
      const user = req.user;

      // Get additional data based on role
      if (user.role === 'waiter') {
        const waiter = await db.Waiter.findByPk(user.id, {
          include: [{ model: db.Zone, as: 'zone' }]
        });
        return res.json({
          success: true,
          data: { waiter: waiter.toJSON() }
        });
      } else if (user.role === 'customer') {
        const customer = await db.Customer.findByPk(user.id, {
          include: [{ model: db.Table, as: 'table' }]
        });
        return res.json({
          success: true,
          data: { customer: customer.toJSON() }
        });
      }

      res.json({
        success: true,
        data: { user: user.toJSON() }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Validate token
   */
  async validateToken(req, res, next) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token is required'
        });
      }

      const decoded = jwtService.verifyToken(token);

      res.json({
        success: true,
        message: 'Token is valid',
        data: { decoded }
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      next(error);
    }
  }
}

module.exports = new AuthController();
