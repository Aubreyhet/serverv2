const express = require('express');
const userRouter = require('./users')
const publicRouter = require('./openapi')
const goodsRouteer = require('./goods')
const importRouteer = require('./importapi')
const orderRouter = require('./orders')
const path = require('path')

const router = express.Router();

router.use('/user', userRouter);
router.use('/goods', goodsRouteer);
router.use('/orders', orderRouter);


router.use('/import', importRouteer)
router.use('/openapi', publicRouter)


router.use('/download', (req, res) => {
  const fileUrl = req.query.fileurl
  if (fileUrl) {
    const filePath = path.join(__dirname, `../public${fileUrl}`)
    res.download(filePath)
  } else {
    res.cc('下载地址有误')
  }
})


module.exports = router;
