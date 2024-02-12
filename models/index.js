'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = 'production';
let config = require(__dirname + '/../config/config.json')[env]
const bcrypt = require('bcryptjs')


const db = {};



let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });



Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});




db.sequelize = sequelize;
db.Sequelize = Sequelize;


(async () => {
  try {
    await sequelize.authenticate()
    const models = sequelize.models;
    const tableNames = Object.keys(models);
    for (const item of tableNames) {
      await tableExists(item)
    }
    try {
      const count = await db['Users'].count();
      if (count === 0) {
        await db['Users'].create({
          username: 'admin',
          password: bcrypt.hashSync('123456', 15)
        })
      }
    } catch (error) {
      console.error('Error checking table:', error);
    }
    console.log('database load ok')
  } catch (error) {
    console.log(error)
  }

})()



const tableExists = async (tableName) => {
  try {
    // 执行 SQL 查询检查表是否存在
    const result = await sequelize.query(`SELECT name FROM sqlite_master WHERE type='table' AND name=:tableName`, {
      replacements: { tableName },
      type: sequelize.QueryTypes.SELECT
    });

    if (result.length === 0) {
      db[tableName].sync({ alter: true })
    }
  } catch (error) {
    console.error('Error checking if table exists:', error);
  }
}






module.exports = db;
