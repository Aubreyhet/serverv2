const { sequelize, jwtSecretKey, jwtExpiresIn } = require('../config/dbconfig');
const { User } = require('../models/user');

const jwt = require('jsonwebtoken')


const bcrypt = require('bcryptjs')


exports.userCreate = async (req, res) => {

  try {
    const userInfo = req.body
    // await sequelize.sync({ alter: true })
    if (!userInfo.username) {
      return res.cc('用户名不能为空')
    }
    const hasUserInfo = await User.findAll({
      where: {
        username: userInfo.username
      }
    })
    if (hasUserInfo.length < 1) {
      const password = userInfo.password ? userInfo.password : '123456'
      const userData = await User.create({
        username: userInfo.username,
        password: bcrypt.hashSync(password, 15)
      })
      res.send({
        status: 0,
        message: '用户创建成功',
        data: {
          username: userData.username
        },
      })
    } else {
      res.cc('用户已存在')
    }
  } catch (error) {
    console.error(error);
    res.cc('新增数据失败')
  }
}


exports.userFindAll = async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ['password'] }
    })
    res.send({
      status: 0,
      data: userData,
      message: '查询成功'
    })

  } catch (error) {
    console.error(error);
  }
}

exports.userLogin = async (req, res) => {
  const userInfo = req.body
  // req.session.user
  if (!userInfo.username || !userInfo.password) {
    return res.cc('用户名密码不能为空')
  }
  // await sequelize.sync({ alter: true })
  const userData = await User.findAll({
    where: {
      username: userInfo.username
    }
  })
  if (userData.length > 0) {
    const compareResult = bcrypt.compareSync(userInfo.password, userData[0].password)
    if (!compareResult) {
      return res.cc('密码错误')
    } else {
      const returnUserInfo = { ...userData[0].dataValues, password: '' }
      const tokenStr = jwt.sign(returnUserInfo, jwtSecretKey, {
        expiresIn: jwtExpiresIn
      })
      res.send({
        data: {
          userData: returnUserInfo,
          token: 'Bearer ' + tokenStr
        },
        message: '登录成功'
      })
    }

  } else {
    res.cc('数据查询失败')
  }
}


exports.userDel = async (req, res) => {
  const userIds = req.body.ids
  try {
    if (userIds && userIds.length > 0) {

      let delCount = 0


      // await sequelize.sync()

      for (const id of userIds) {
        const userInfo = await User.findAll({
          where: {
            id
          }
        })
        if (userInfo.length > 0) {
          await User.destroy({
            where: {
              id
            }
          })
          delCount++
        }

      }

      res.send({
        message: '数据删除成功',
        data: {
          del_count: delCount
        },
        satus: 0
      })




    }

  } catch (error) {
    res.cc('数据查询失败')
  }
}


