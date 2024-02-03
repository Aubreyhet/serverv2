const goodsController = require('../controllers/goods')
const express = require('express');


const router = express.Router();



router.get('/list', goodsController.findAllGoodsList)
router.post('/update', goodsController.updateGoodById)
router.get('/find', goodsController.findGoodByCode)
router.delete('/del', goodsController.delGoodById)



module.exports = router;
