module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  bcryptSaltRounds: 10,
  pinMinLength: 4,
  pinMaxLength: 6,
  
  roles: {
    OWNER: 'owner',
    ADMIN: 'admin',
    WAITER: 'waiter',
    DEVELOPER: 'developer',
    CUSTOMER: 'customer'
  },
  
  permissions: {
    owner: ['*'],
    admin: ['orders', 'shifts', 'users', 'menu', 'reports', 'approve'],
    waiter: ['orders', 'shifts', 'tables', 'payments'],
    developer: ['system', 'logs', 'qr'],
    customer: ['menu', 'orders', 'ratings']
  }
};
