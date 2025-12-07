'use strict';

module.exports = (sequelize, DataTypes) => {
  const ClosingReport = sequelize.define('ClosingReport', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    shiftId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'shift_id'
    },
    reportDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'report_date'
    },
    reportType: {
      type: DataTypes.ENUM('shift', 'daily', 'weekly', 'monthly'),
      allowNull: false,
      field: 'report_type'
    },
    totalRevenue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_revenue'
    },
    cashRevenue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'cash_revenue'
    },
    cardRevenue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'card_revenue'
    },
    totalOrders: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'total_orders'
    },
    totalTax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_tax'
    },
    taxBreakdown: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'tax_breakdown'
    },
    totalTips: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'total_tips'
    },
    voidedOrders: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'voided_orders'
    },
    voidedAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'voided_amount'
    },
    cashDrawerDifference: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'cash_drawer_difference'
    },
    reportData: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'report_data',
      comment: 'Complete report data with all metrics'
    },
    generatedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'generated_by'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'closing_reports',
    timestamps: true
  });

  ClosingReport.associate = function(models) {
    ClosingReport.belongsTo(models.Shift, { foreignKey: 'shiftId', as: 'shift' });
    ClosingReport.belongsTo(models.User, { foreignKey: 'generatedBy', as: 'generator' });
  };

  return ClosingReport;
};
