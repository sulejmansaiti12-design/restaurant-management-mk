'use strict';

module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define('MenuItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'category_id'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 18.00,
      field: 'tax_rate',
      comment: 'Macedonian VAT rate: 18%, 10%, 5%, or 0%'
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_available'
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_popular'
    },
    preparationTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'preparation_time',
      comment: 'Time in minutes'
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    allergens: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order'
    },
    totalOrdered: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_ordered'
    }
  }, {
    tableName: 'menu_items',
    timestamps: true
  });

  MenuItem.associate = function(models) {
    MenuItem.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    MenuItem.hasMany(models.OrderItem, { foreignKey: 'menuItemId', as: 'orderItems' });
  };

  return MenuItem;
};
