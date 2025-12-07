'use strict';

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    channel: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'kitchen, bar, admin, waiter, all'
    },
    eventType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'event_type',
      comment: 'order_new, order_ready, void_request, system_alert'
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    recipientId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'recipient_id'
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_read'
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'read_at'
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expires_at'
    }
  }, {
    tableName: 'notifications',
    timestamps: true
  });

  return Notification;
};
