'use strict';

module.exports = (sequelize, DataTypes) => {
  const CashTransaction = sequelize.define('CashTransaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    cashDrawerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'cash_drawer_id'
    },
    type: {
      type: DataTypes.ENUM('sale', 'deposit', 'withdrawal', 'adjustment'),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    balanceBefore: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'balance_before'
    },
    balanceAfter: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'balance_after'
    },
    referenceId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'reference_id',
      comment: 'Order ID or other reference'
    },
    performedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'performed_by'
    },
    reason: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'cash_transactions',
    timestamps: true
  });

  CashTransaction.associate = function(models) {
    CashTransaction.belongsTo(models.CashDrawer, { foreignKey: 'cashDrawerId', as: 'cashDrawer' });
    CashTransaction.belongsTo(models.User, { foreignKey: 'performedBy', as: 'performer' });
  };

  return CashTransaction;
};
