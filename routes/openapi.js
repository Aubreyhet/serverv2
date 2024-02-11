
const express = require('express');

const userController = require('../controllers/user')

const { version } = require('../package.json')


const joi = require('joi')
const expressJoi = require('@escook/express-joi')


const router = express.Router();


const loginSchema = {
  body: {
    username: joi.string().alphanum().min(4).max(10).required(),
    password: joi.string().min(6).required()
  }
}


// 登录
router.post('/login', expressJoi(loginSchema), userController.userLogin)
router.get('/version', (req, res) => {
  try {
    res.send({
      status: 0,
      version
    })
  } catch (error) {
    res.cc('获取版本信息失败')
  }
})


module.exports = router;
