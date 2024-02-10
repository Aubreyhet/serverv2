
const express = require('express');

const userController = require('../controllers/user')


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


module.exports = router;
