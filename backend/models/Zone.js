'use strict';

module.exports = (sequelize, DataTypes) => {
  const Zone = sequelize.define('Zone', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: true,
      defaultValue: '#3498db'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    tableName: 'zones',
    timestamps: true
  });

  Zone.associate = function(models) {
    Zone.hasMany(models.Table, { foreignKey: 'zoneId', as: 'tables' });
    Zone.hasMany(models.Waiter, { foreignKey: 'zoneId', as: 'waiters' });
  };

  return Zone;
};
