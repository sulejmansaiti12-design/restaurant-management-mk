'use strict';

module.exports = (sequelize, DataTypes) => {
  const Station = sequelize.define('Station', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.ENUM('kitchen', 'bar', 'dessert', 'grill'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order'
    }
  }, {
    tableName: 'stations',
    timestamps: true
  });

  return Station;
};
