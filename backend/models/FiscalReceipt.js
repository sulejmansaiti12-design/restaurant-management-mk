'use strict';

module.exports = (sequelize, DataTypes) => {
  const FiscalReceipt = sequelize.define('FiscalReceipt', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: 'order_id'
    },
    fiscalNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'fiscal_number',
      comment: 'Format: FIS-YYYYMMDD-NNNNN'
    },
    receiptDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'receipt_date'
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_amount'
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'tax_amount'
    },
    taxBreakdown: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'tax_breakdown'
    },
    receiptData: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'receipt_data',
      comment: 'Complete receipt data for UPS submission'
    },
    verificationCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'verification_code'
    },
    status: {
      type: DataTypes.ENUM('issued', 'verified', 'cancelled', 'failed'),
      defaultValue: 'issued'
    },
    submittedToUPS: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'submitted_to_ups'
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'submitted_at'
    }
  }, {
    tableName: 'fiscal_receipts',
    timestamps: true
  });

  FiscalReceipt.associate = function(models) {
    FiscalReceipt.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
  };

  return FiscalReceipt;
};
