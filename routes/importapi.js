const multer = require('multer')
const express = require('express');
const path = require('path')

const goodsController = require('../controllers/goods')

const router = express.Router();





const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage })




// router.post('/goods', upload.single('goods_stock'), goodsController.saveDataToSql)
router.post('/goods', upload.single('goods_stock'), (req, res) => {
  console.log(req.file)
  res.send({
    msg: '上传成功'
  })
})


module.exports = router;