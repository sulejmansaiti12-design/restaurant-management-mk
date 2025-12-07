'use strict';

module.exports = (sequelize, DataTypes) => {
  const TaxConfig = sequelize.define('TaxConfig', {
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
    rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_default'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    effectiveFrom: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'effective_from'
    },
    effectiveTo: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'effective_to'
    }
  }, {
    tableName: 'tax_configs',
    timestamps: true
  });

  return TaxConfig;
};
