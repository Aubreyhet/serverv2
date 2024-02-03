
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { sequelize } = require('../config/dbconfig');
const { Order, OrderItem } = require('../models/orders');
const { User } = require('../models/user');

const { getTimestamp, getParserTime } = require('../utils/index');
const { Goods } = require('../models/goods');




exports.createPendingOrder = async () => {

}

exports.findAllOrder = async (req, res) => {

  const page = parseInt(req.query.page) || 1
  const page_size = parseInt(req.query.limit) || 50

  try {
    const orderList = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'createdAt', 'is_delete'],
          as: 'settle_user'
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Goods
            }
          ]
        }
      ],
      limit: page_size,
      offset: (page - 1) * page_size
    })

    const orderCount = await Order.count()


    res.send({
      status: 0,
      data: {
        order_list: orderList,
        count: orderCount,
        page,
        page_size
      },
      message: '订单数据查询成功'
    })

  } catch (error) {
    console.log(error)
    res.cc('订单数据查询失败')
  }


}

exports.findOrderById = async (req, res) => {

  const orderId = req.body.id

  try {
    const orderInfo = await Order.findAll({
      where: {
        id: orderId
      }
    })



    res.send({
      status: 0,
      data: {
        order_info: orderInfo[0]
      },
      message: '订单数据查询成功'
    })

  } catch (error) {
    res.cc('订单数据查询失败')
  }
}

exports.createSettlementedOrder = async (req, res) => {
  const orderInfo = req.body
  const userName = req.auth.username


  try {
    const hasOrderInfo = await Order.findAll({
      where: {
        order_no: orderInfo.order_no
      }
    })
    if (hasOrderInfo.length < 1) {
      const orderData = await Order.create({
        order_no: orderInfo.order_no,
        order_status: 'settlemented',
        product_count: orderInfo.product_count,
        product_amount_total: orderInfo.product_amount_total,
        order_amount_total: orderInfo.order_amount_total,
        pay_channel: orderInfo.pay_channel,
        order_create_time: new Date().getTime(),
        order_settle_time: new Date().getTime(),
        order_settle_user: userName,
        orderItems: orderInfo.orderItems
      }, {
        include: [
          {
            model: OrderItem,
            as: 'orderItems'
          }
        ]
      })
      res.send({
        status: 0,
        message: '结算成功',
        data: {
          order_data: orderData
        },
      })
    } else {
      res.cc('订单编号已存在')
    }
  } catch (error) {
    console.log(error)
    res.cc('订单结算失败')
  }


}



exports.createOrderNumber = async (req, res) => {
  const currentStartTime = getTimestamp()
  const currentDate = getParserTime()
  const userId = req.auth.id

  try {

    const currentStartOrder = await Order.count({
      where: {
        order_create_time: {
          [Op.gte]: Sequelize.literal(`${currentStartTime}`)
        }
      }
    })


    const orderNextNumber = `${currentDate}${(parseInt(userId)).toString().padStart(2, '0')}${(parseInt(currentStartOrder) + 1).toString().padStart(4, '0')}`


    res.send({
      data: {
        count: orderNextNumber
      },
      status: 0,
      message: '获取成功'
    })

  } catch (error) {
    res.cc('订单编号返回失败')
  }
}

exports.delOrderById = async (req, res) => {
  const orderId = req.body.id
  try {

    const orderInfo = await Order.findAll({
      where: {
        id: orderId
      }
    })
    if (orderInfo.length > 0) {
      await Order.destroy({
        where: {
          id: orderId
        }
      })
    }
    res.send({
      status: 0,
      message: '删除成功'
    })

  } catch (error) {
    res.cc('订单删除失败')
  }
}
