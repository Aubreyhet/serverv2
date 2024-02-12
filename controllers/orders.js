
const { getTimestamp, getParserTime } = require('../utils/index');

const { Orders, OrderItems, Users, Goods, sequelize, Sequelize } = require('../models')

const { Op } = Sequelize;
const xlsx = require('xlsx');

const { orderConfig } = require('../config/goodsconfis')





exports.createPendingOrder = async () => {

}

exports.findAllOrder = async (req, res) => {

  const page = parseInt(req.query.page) || 1
  const page_size = parseInt(req.query.limit) || 50

  try {
    const whereObj = {}
    for (let key in orderConfig) {
      if (req.query[key]) {
        whereObj[key] = {
          [Op.like]: `%${req.query[key]}%`,
        }
      }
    }
    const orderList = await Orders.findAll({
      include: [
        {
          model: Users,
          attributes: ['id', 'username', 'createdAt', 'is_delete'],
          as: 'settle_user'
        },
        {
          model: OrderItems,
          as: 'OrderItems',
        }
      ],
      where: {
        ...whereObj
      },
      limit: page_size,
      offset: (page - 1) * page_size
    })

    const orderCount = await Orders.count({
      where: {
        ...whereObj
      }
    })


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
    const orderInfo = await Orders.findAll({
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
    const hasOrderInfo = await Orders.findAll({
      where: {
        order_no: orderInfo.order_no
      }
    })
    if (hasOrderInfo.length < 1) {

      const t = await sequelize.transaction()

      try {

        const orderData = await Orders.create({
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
          transaction: t,
          include: [
            {
              model: OrderItems,
              as: 'OrderItems'
            }
          ],
        })


        for (const item of orderInfo.orderItems) {
          const existingStock = await Goods.findOne({ attributes: ['good_stock'], where: { good_code: item.good_code }, transaction: t });
          console.log(existingStock.good_stock, item.product_count)
          if (existingStock && existingStock.good_stock >= item.product_count) {
            await Goods.decrement('good_stock', { by: item.product_count, where: { good_code: item.good_code }, transaction: t });
          } else {
            throw new Error(`商品 ${item.good_code} 库存不足`);
          }
        }

        await t.commit();


        res.send({
          status: 0,
          message: '结算成功',
          data: {
            order_data: orderData
          },
        })

      } catch (error) {
        console.log(error)
        res.cc('订单处理失败')
        await t.rollback();

      }









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

    const currentStartOrder = await Orders.count({
      where: {
        order_create_time: {
          [Op.gte]: Sequelize.literal(`${currentStartTime}`)
        }
      }
    })


    const orderNextNumber = `${currentDate}${(parseInt(userId)).toString().padStart(2, '0')}${(parseInt(currentStartOrder) + 1).toString().padStart(4, '0')}`


    res.send({
      data: {
        current_order_num: orderNextNumber
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

    const orderInfo = await Orders.findAll({
      where: {
        id: orderId
      }
    })
    if (orderInfo.length > 0) {
      await Orders.destroy({
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


exports.exportFiles = async (req, res) => {

  const fileType = 'csv'
  const file_name = `${Date.now()}.${fileType}`

  try {
    const whereObj = {}

    for (let key in orderConfig) {
      if (req.query[key]) {
        whereObj[key] = {
          [Op.like]: `%${req.query[key]}%`,
        }
      }
    }
    const resData = await Orders.findAll({
      where: {
        ...whereObj
      }
    })

    const header = Object.values(orderConfig);
    const goodsData = [[' ', ...header], ...resData.map(good => Object.values(good.dataValues))]
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(goodsData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${file_name}"`);
    const fileBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'csv' });
    res.send(fileBuffer);
    // const download_file_url = await writeDataToFile(file_name, fileType, resData, orderConfig)
    // res.send({
    //   data: {
    //     download_file_url,
    //     file_name
    //   },
    //   status: 0,
    //   message: '文件生成成功！'
    // })
  } catch (error) {
    console.log(error)
    res.cc('数据查询失败')
  }
}
