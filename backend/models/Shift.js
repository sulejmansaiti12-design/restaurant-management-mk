'use strict';

module.exports = (sequelize, DataTypes) => {
  const Shift = sequelize.define('Shift', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    waiterId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'waiter_id'
    },
    zoneId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'zone_id'
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_time'
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'end_time'
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Duration in minutes'
    },
    totalRevenue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'total_revenue'
    },
    cashRevenue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'cash_revenue'
    },
    cardRevenue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'card_revenue'
    },
    totalOrders: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_orders'
    },
    totalTips: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'total_tips'
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'abandoned'),
      defaultValue: 'active'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'shifts',
    timestamps: true
  });

  Shift.associate = function(models) {
    Shift.belongsTo(models.Waiter, { foreignKey: 'waiterId', as: 'waiter' });
    Shift.belongsTo(models.Zone, { foreignKey: 'zoneId', as: 'zone' });
    Shift.hasMany(models.Order, { foreignKey: 'shiftId', as: 'orders' });
    Shift.hasOne(models.ClosingReport, { foreignKey: 'shiftId', as: 'closingReport' });
  };

  return Shift;
};
