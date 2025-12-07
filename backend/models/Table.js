'use strict';

module.exports = (sequelize, DataTypes) => {
  const Table = sequelize.define('Table', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    tableNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'table_number'
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4
    },
    zoneId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'zone_id'
    },
    status: {
      type: DataTypes.ENUM('free', 'occupied', 'reserved', 'cleaning'),
      defaultValue: 'free'
    },
    qrCode: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'qr_code'
    },
    positionX: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'position_x'
    },
    positionY: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'position_y'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    tableName: 'tables',
    timestamps: true
  });

  Table.associate = function(models) {
    Table.belongsTo(models.Zone, { foreignKey: 'zoneId', as: 'zone' });
    Table.hasMany(models.Order, { foreignKey: 'tableId', as: 'orders' });
    Table.hasMany(models.Customer, { foreignKey: 'tableId', as: 'customers' });
  };

  return Table;
};
