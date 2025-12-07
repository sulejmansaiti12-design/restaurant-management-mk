'use strict';

module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    foodQuality: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'food_quality'
    },
    serviceSpeed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'service_speed'
    },
    staffFriendliness: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'staff_friendliness'
    },
    cleanliness: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'cleanliness'
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_anonymous'
    }
  }, {
    tableName: 'ratings',
    timestamps: true
  });

  Rating.associate = function(models) {
    Rating.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
    Rating.belongsTo(models.Customer, { foreignKey: 'customerId', as: 'customer' });
    Rating.belongsTo(models.Waiter, { foreignKey: 'waiterId', as: 'waiter' });
  };

  return Rating;
};
