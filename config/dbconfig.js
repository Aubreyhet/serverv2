
const path = require('path')


const Sequelize = require('sequelize');

const sequelize = new Sequelize('cashier_db', '', '', {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../db/cashier.sqlite3')
});


(async () => {
  try {
    await sequelize.authenticate()
    console.log('数据库连接成功')
  } catch (error) {
    console.log(err)
  }

})()

const jwtSecretKey = 'gendy!!!No 1. ^_^!!!'

const jwtExpiresIn = '10h'




module.exports = { sequelize, jwtSecretKey, jwtExpiresIn };

