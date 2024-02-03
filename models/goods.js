const { sequelize } = require('../config/dbconfig');
const { DataTypes } = require('sequelize')

const Goods = sequelize.define('goods', {
  store: {
    type: DataTypes.STRING
  },
  picture: {
    type: DataTypes.STRING
  },
  shape_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  good_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  good_name: {
    type: DataTypes.STRING
  },
  good_color_norm: {
    type: DataTypes.STRING
  },
  good_stock: {
    type: DataTypes.INTEGER
  },
  good_brand: {
    type: DataTypes.STRING
  },
  good_years: {
    type: DataTypes.INTEGER
  },
  good_season: {
    type: DataTypes.STRING
  },
  good_sell: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
});

// Goods.sync({ alter: true })

module.exports = {
  Goods
}
