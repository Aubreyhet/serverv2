const orderController = require('../controllers/orders')
const express = require('express');


const router = express.Router();

// 订单编号
router.get('/order_no', orderController.createOrderNumber)



// 所有订单数据
router.get('/list', orderController.findAllOrder)


// 订单数据详情
router.get('/order_info', orderController.findOrderById)


// 取单



// 挂单



// 结算
router.post('/settle', orderController.createSettlementedOrder)

router.delete('/', orderController.delOrderById)




module.exports = router;
