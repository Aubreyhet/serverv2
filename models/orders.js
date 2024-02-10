


module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define('Orders', {
    order_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    order_status: {
      type: DataTypes.ENUM('pending', 'settlemented', 'returned', 'exchanged'),
      allowNull: false,
    },
    product_count: {
      type: DataTypes.INTEGER
    },
    product_amount_total: {
      type: DataTypes.DECIMAL(10, 2)
    },
    order_amount_total: {
      type: DataTypes.DECIMAL(10, 2)
    },
    pay_channel: {
      type: DataTypes.ENUM('cash', 'alipay', 'wechat', 'bank_card', 'other'),
      allowNull: false,
    },
    order_create_time: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    order_settle_time: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    order_settle_user: {
      type: DataTypes.STRING
    }
  });


  Orders.associate = (models) => {
    Orders.belongsTo(models.Users, { foreignKey: 'order_settle_user', targetKey: 'username', as: 'settle_user' });
    Orders.hasMany(models.OrderItems, { as: 'OrderItems', foreignKey: 'order_id' });
  };


  return Orders
}

