'use strict';

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
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
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'card', 'mixed'),
      allowNull: false,
      field: 'payment_method'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    cashAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'cash_amount'
    },
    cardAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'card_amount'
    },
    amountTendered: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'amount_tendered',
      comment: 'For cash: amount given by customer'
    },
    changeGiven: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'change_given'
    },
    tipAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'tip_amount'
    },
    cardLast4: {
      type: DataTypes.STRING(4),
      allowNull: true,
      field: 'card_last4'
    },
    cardType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'card_type',
      comment: 'visa, mastercard, amex, etc.'
    },
    transactionId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      field: 'transaction_id'
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'completed'
    },
    processedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'processed_by'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'payments',
    timestamps: true
  });

  Payment.associate = function(models) {
    Payment.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
    Payment.belongsTo(models.Waiter, { foreignKey: 'processedBy', as: 'processor' });
  };

  return Payment;
};
