
module.exports = (sequelize, DataTypes) => {
  const OrderItems = sequelize.define('OrderItems', {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    good_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    good_code: {
      type: DataTypes.STRING,
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

  OrderItems.associate = (models) => {
    OrderItems.belongsTo(models.Orders, { foreignKey: 'order_id', targetKey: 'id' });
    OrderItems.belongsTo(models.Goods, { foreignKey: 'good_id', targetKey: 'id', constraints: false });
  };
  return OrderItems
}

