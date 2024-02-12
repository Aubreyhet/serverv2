const multer = require('multer')
const express = require('express');
const path = require('path')
const fs = require('fs')

const goodsController = require('../controllers/goods')

const router = express.Router();


const uploadDirectory = 'uploads/';

// 检查目录是否存在，如果不存在则创建它
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}





const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage })




router.post('/goods', upload.single('goods_stock'), goodsController.saveDataToSql)
// router.post('/goods', upload.single('goods_stock'), (req, res) => {
//   console.log(req.file)
//   res.send({
//     msg: '上传成功'
//   })
// })


module.exports = router;
