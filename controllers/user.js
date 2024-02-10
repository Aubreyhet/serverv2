const { jwtSecretKey, jwtExpiresIn } = require('../config/dbconfig');
const { Users } = require('../models');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


exports.userCreate = async (req, res) => {

  try {
    const userInfo = req.body
    if (!userInfo.username) {
      return res.cc('用户名不能为空')
    }
    const hasUserInfo = await Users.findAll({
      where: {
        username: userInfo.username
      }
    })
    if (hasUserInfo.length < 1) {
      const password = userInfo.password ? userInfo.password : '123456'
      const userData = await Users.create({
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
    let usersCount = 0
    const userData = await Users.findAll({
      limit: req.query.limit,
      offset: (req.query.page - 1) * req.query.limit,
      attributes: { exclude: ['password'] }
    })

    usersCount = await Users.count()
    res.send({
      status: 0,
      data: {
        users_list: userData,
        count: usersCount,
        page: parseInt(req.query.page),
        page_size: parseInt(req.query.limit)
      },
      message: '数据查询成功'
    })

  } catch (error) {
    console.error(error);
    res.cc('数据查询失败')
  }
}


exports.userFindOne = async (req, res) => {
  const username = req.query.username
  try {
    const userData = await Users.findAll({
      where: {
        username
      }
    })

    res.send({
      status: 0,
      data: userData,
      message: '数据查询成功'
    })

  } catch (error) {
    console.error(error);
    res.cc('数据查询失败')
  }
}

exports.userLogin = async (req, res) => {
  const userInfo = req.body
  if (!userInfo.username || !userInfo.password) {
    return res.cc('用户名密码不能为空')
  }

  try {
    const userData = await Users.findAll({
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
      res.cc('登录账户不存在')
    }
  } catch (error) {
    res.cc('数据查询失败' + error)
  }

}


exports.userDel = async (req, res) => {
  const userIds = req.body.ids
  try {
    if (userIds && userIds.length > 0) {

      let delCount = 0

      for (const id of userIds) {
        const userInfo = await Users.findAll({
          where: {
            id
          }
        })
        if (userInfo.length > 0) {
          await Users.destroy({
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


