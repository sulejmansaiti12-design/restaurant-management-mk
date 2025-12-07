'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Waiter = sequelize.define('Waiter', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'last_name'
    },
    pin: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    zoneId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'zone_id'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    totalRevenue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'total_revenue'
    },
    totalOrders: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_orders'
    },
    averageRating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00,
      field: 'average_rating'
    },
    totalRatings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_ratings'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login'
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'refresh_token'
    }
  }, {
    tableName: 'waiters',
    timestamps: true,
    hooks: {
      beforeCreate: async (waiter) => {
        if (waiter.pin) {
          const salt = await bcrypt.genSalt(10);
          waiter.pin = await bcrypt.hash(waiter.pin, salt);
        }
      },
      beforeUpdate: async (waiter) => {
        if (waiter.changed('pin')) {
          const salt = await bcrypt.genSalt(10);
          waiter.pin = await bcrypt.hash(waiter.pin, salt);
        }
      }
    }
  });

  Waiter.prototype.validatePin = async function(pin) {
    return await bcrypt.compare(pin, this.pin);
  };

  Waiter.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.pin;
    delete values.refreshToken;
    return values;
  };

  Waiter.associate = function(models) {
    Waiter.belongsTo(models.Zone, { foreignKey: 'zoneId', as: 'zone' });
    Waiter.hasMany(models.Order, { foreignKey: 'waiterId', as: 'orders' });
    Waiter.hasMany(models.Shift, { foreignKey: 'waiterId', as: 'shifts' });
    Waiter.hasMany(models.Rating, { foreignKey: 'waiterId', as: 'ratings' });
    Waiter.hasMany(models.ClockRecord, { foreignKey: 'waiterId', as: 'clockRecords' });
  };

  return Waiter;
};
