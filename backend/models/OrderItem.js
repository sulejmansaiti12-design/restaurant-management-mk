'use strict';

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'order_id'
    },
    menuItemId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'menu_item_id'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'unit_price'
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: 'tax_rate'
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'tax_amount'
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'quantity * unitPrice'
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'subtotal + taxAmount'
    },
    specialInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'special_instructions'
    },
    status: {
      type: DataTypes.ENUM('pending', 'preparing', 'ready', 'served'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'order_items',
    timestamps: true
  });

  OrderItem.associate = function(models) {
    OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
    OrderItem.belongsTo(models.MenuItem, { foreignKey: 'menuItemId', as: 'menuItem' });
  };

  return OrderItem;
};
