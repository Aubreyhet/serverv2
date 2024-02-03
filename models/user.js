const { sequelize } = require('../config/dbconfig');
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING
  },
  is_delete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});


module.exports = {
  User
}
