'use strict';

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    tableId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'table_id'
    },
    sessionToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      field: 'session_token'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_anonymous'
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_active'
    }
  }, {
    tableName: 'customers',
    timestamps: true
  });

  Customer.associate = function(models) {
    Customer.belongsTo(models.Table, { foreignKey: 'tableId', as: 'table' });
    Customer.hasMany(models.Order, { foreignKey: 'customerId', as: 'orders' });
    Customer.hasMany(models.Rating, { foreignKey: 'customerId', as: 'ratings' });
  };

  return Customer;
};
