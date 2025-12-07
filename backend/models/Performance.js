'use strict';

module.exports = (sequelize, DataTypes) => {
  const Performance = sequelize.define('Performance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    waiterId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: 'waiter_id'
    },
    period: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'day, week, month, year, all-time'
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
    averageOrderValue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'average_order_value'
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
    totalTips: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'total_tips'
    },
    totalShifts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_shifts'
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lastCalculated: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_calculated'
    }
  }, {
    tableName: 'performances',
    timestamps: true
  });

  Performance.associate = function(models) {
    Performance.belongsTo(models.Waiter, { foreignKey: 'waiterId', as: 'waiter' });
  };

  return Performance;
};
