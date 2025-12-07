'use strict';

module.exports = (sequelize, DataTypes) => {
  const Printer = sequelize.define('Printer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('receipt', 'kitchen', 'bar', 'label'),
      allowNull: false
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'ip_address'
    },
    port: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    status: {
      type: DataTypes.ENUM('online', 'offline', 'error'),
      defaultValue: 'offline'
    },
    lastPing: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_ping'
    },
    settings: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    tableName: 'printers',
    timestamps: true
  });

  return Printer;
};
