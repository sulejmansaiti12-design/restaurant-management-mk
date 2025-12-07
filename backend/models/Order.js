'use strict';

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'order_number'
    },
    tableId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'table_id'
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'customer_id'
    },
    waiterId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'waiter_id'
    },
    shiftId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'shift_id'
    },
    status: {
      type: DataTypes.ENUM(
        'pending', 'accepted', 'declined', 'preparing',
        'ready', 'served', 'paid', 'cancelled', 'voided'
      ),
      defaultValue: 'pending'
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    totalTax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'total_tax'
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    taxBreakdown: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'tax_breakdown',
      comment: 'JSON: {"18": {items: 3, subtotal: 1500, tax: 270}, ...}'
    },
    customerCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: 'customer_count'
    },
    specialInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'special_instructions'
    },
    fiscalNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      field: 'fiscal_number',
      comment: 'Format: FIS-YYYYMMDD-NNNNN'
    },
    isFiscal: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_fiscal'
    },
    voidReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'void_reason'
    },
    voidedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'voided_at'
    },
    voidedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'voided_by'
    },
    acceptedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'accepted_at'
    },
    preparingAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'preparing_at'
    },
    readyAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'ready_at'
    },
    servedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'served_at'
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'paid_at'
    }
  }, {
    tableName: 'orders',
    timestamps: true
  });

  Order.associate = function(models) {
    Order.belongsTo(models.Table, { foreignKey: 'tableId', as: 'table' });
    Order.belongsTo(models.Customer, { foreignKey: 'customerId', as: 'customer' });
    Order.belongsTo(models.Waiter, { foreignKey: 'waiterId', as: 'waiter' });
    Order.belongsTo(models.Shift, { foreignKey: 'shiftId', as: 'shift' });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
    Order.hasOne(models.Payment, { foreignKey: 'orderId', as: 'payment' });
    Order.hasOne(models.Rating, { foreignKey: 'orderId', as: 'rating' });
    Order.hasOne(models.VoidCompRequest, { foreignKey: 'orderId', as: 'voidRequest' });
    Order.hasOne(models.FiscalReceipt, { foreignKey: 'orderId', as: 'fiscalReceipt' });
  };

  return Order;
};
