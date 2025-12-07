'use strict';

module.exports = (sequelize, DataTypes) => {
  const CashDrawer = sequelize.define('CashDrawer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    openedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'opened_by'
    },
    closedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'closed_by'
    },
    openedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'opened_at'
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'closed_at'
    },
    openingBalance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'opening_balance'
    },
    closingBalance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'closing_balance'
    },
    expectedBalance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'expected_balance'
    },
    actualBalance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'actual_balance'
    },
    difference: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'actualBalance - expectedBalance'
    },
    totalCashSales: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'total_cash_sales'
    },
    totalDeposits: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'total_deposits'
    },
    totalWithdrawals: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'total_withdrawals'
    },
    status: {
      type: DataTypes.ENUM('open', 'closed', 'reconciled'),
      defaultValue: 'open'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'cash_drawers',
    timestamps: true
  });

  CashDrawer.associate = function(models) {
    CashDrawer.belongsTo(models.User, { foreignKey: 'openedBy', as: 'opener' });
    CashDrawer.belongsTo(models.User, { foreignKey: 'closedBy', as: 'closer' });
    CashDrawer.hasMany(models.CashTransaction, { foreignKey: 'cashDrawerId', as: 'transactions' });
  };

  return CashDrawer;
};
