'use strict';

module.exports = (sequelize, DataTypes) => {
  const VoidCompRequest = sequelize.define('VoidCompRequest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'order_id'
    },
    requestedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'requested_by'
    },
    type: {
      type: DataTypes.ENUM('void', 'comp'),
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    reviewedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'reviewed_by'
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reviewed_at'
    },
    reviewNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'review_notes'
    }
  }, {
    tableName: 'void_comp_requests',
    timestamps: true
  });

  VoidCompRequest.associate = function(models) {
    VoidCompRequest.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
    VoidCompRequest.belongsTo(models.Waiter, { foreignKey: 'requestedBy', as: 'requester' });
    VoidCompRequest.belongsTo(models.User, { foreignKey: 'reviewedBy', as: 'reviewer' });
  };

  return VoidCompRequest;
};
