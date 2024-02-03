const userController = require('../controllers/user')
const express = require('express');


const joi = require('joi')
const expressJoi = require('@escook/express-joi')


const router = express.Router();





// 创建用户
router.post('/', expressJoi({
  body: {
    username: joi.string().alphanum().min(4).max(10).required(),
    password: joi.string().min(6)
  }
}), userController.userCreate)


// 获取所有用户数据
router.get('/', userController.userFindAll);


router.delete('/del', userController.userDel)




// 修改密码
router.post('/updatepwd', expressJoi({
  body: {
    username: joi.string().alphanum().min(4).max(10).required(),
    password: joi.string().min(6).required(),
    newpassword: joi.string().min(6).required(),
    refnewpassword: joi.ref('newpassword')
  }
}), () => {

})

// 修改信息
router.post('/updateinfo', expressJoi({
  body: {
    username: joi.string().alphanum().min(4).max(10).required(),
    password: joi.string().min(6).required(),
    newusername: joi.string().alphanum().min(4).max(10).required(),
  }
}), () => {

})


module.exports = router;
