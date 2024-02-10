const goodsController = require('../controllers/goods')
const express = require('express');


const router = express.Router();



router.post('/update', goodsController.updateGoodById)

router.get('/list', goodsController.findAllGoodsList)
router.get('/find', goodsController.findGoodByCode)
router.get('/export', goodsController.exportFiles)
router.get('/filter', goodsController.findFilterOptions)

router.delete('/del', goodsController.delGoodById)



module.exports = router;
