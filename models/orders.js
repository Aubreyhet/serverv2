const { sequelize } = require('../config/dbconfig');
const { DataTypes } = require('sequelize')

const { User } = require('./user')
const { Goods } = require('./goods')

const Order = sequelize.define('order', {
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

Order.belongsTo(User, { foreignKey: 'order_settle_user', targetKey: 'username', as: 'settle_user' });


const OrderItem = sequelize.define('order_item', {
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  good_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_count: {
    type: DataTypes.INTEGER
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  product_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },

})

OrderItem.belongsTo(Order, { foreignKey: 'order_id', targetKey: 'id' });
OrderItem.belongsTo(Goods, { foreignKey: 'good_id', targetKey: 'id' });
Order.hasMany(OrderItem, { as: 'orderItems', foreignKey: 'order_id' });


// sequelize.sync()
// Goods.sync({ alter: true })




module.exports = {
  Order,
  OrderItem
}
