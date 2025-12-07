'use strict';

module.exports = (sequelize, DataTypes) => {
  const ClockRecord = sequelize.define('ClockRecord', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    waiterId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'waiter_id'
    },
    clockIn: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'clock_in'
    },
    clockOut: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'clock_out'
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Duration in minutes'
    },
    type: {
      type: DataTypes.ENUM('regular', 'overtime', 'manual'),
      defaultValue: 'regular'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'clock_records',
    timestamps: true
  });

  ClockRecord.associate = function(models) {
    ClockRecord.belongsTo(models.Waiter, { foreignKey: 'waiterId', as: 'waiter' });
  };

  return ClockRecord;
};
