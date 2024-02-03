
const fs = require('fs')
const iconv = require('iconv-lite')
const xlsx = require('xlsx');

const { goodsConfig } = require('../config/goodsconfis')

const { sequelize } = require('../config/dbconfig');
const { Goods } = require('../models/goods')





const parserFile = (fileObj) => {
  let sheetData = null
  const fileBuffer = fs.readFileSync(`./uploads/${fileObj.filename}`)
  const decodedString = iconv.decode(fileBuffer, 'gbk');
  const workbook = xlsx.read(decodedString, { type: 'binary' });
  const sheetName = workbook.SheetNames[0];
  sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return sheetData
}


exports.saveDataToSql = async (req, res) => {

  if (req.file) {
    const sheetData = parserFile(req.file)

    try {
      // await sequelize.sync()

      if (sheetData && sheetData.length > 0) {
        const countObj = {
          importCount: 0,
          updateCount: 0
        }
        for (const item of sheetData) {
          if (item[goodsConfig.shape_code] && item[goodsConfig.good_code] && item[goodsConfig.good_sell]) {
            const hasData = await Goods.findAll({
              where: {
                shape_code: item[goodsConfig.shape_code],
                good_code: item[goodsConfig.good_code],
              }
            })

            if (hasData.length > 0) {
              await hasData[0].update({
                store: item[goodsConfig.store],
                picture: item[goodsConfig.picture],
                good_name: item[goodsConfig.good_name],
                good_color_norm: item[goodsConfig.good_color_norm],
                good_stock: item[goodsConfig.good_stock] + hasData[0].good_stock,
                good_brand: item[goodsConfig.good_brand],
                good_years: item[goodsConfig.good_years],
                good_season: item[goodsConfig.good_season],
                good_sell: item[goodsConfig.good_sell]
              })
              await hasData[0].save()
              countObj.updateCount++
            }

            if (hasData.length < 1) {
              await Goods.create({
                store: item[goodsConfig.store],
                picture: item[goodsConfig.picture],
                shape_code: item[goodsConfig.shape_code],
                good_code: item[goodsConfig.good_code],
                good_name: item[goodsConfig.good_name],
                good_color_norm: item[goodsConfig.good_color_norm],
                good_stock: item[goodsConfig.good_stock],
                good_brand: item[goodsConfig.good_brand],
                good_years: item[goodsConfig.good_years],
                good_season: item[goodsConfig.good_season],
                good_sell: item[goodsConfig.good_sell]
              })
              countObj.importCount++
            }
          }


        }

        res.send({
          status: 0,
          data: {
            countObj
          },
          message: '数据更新成功'
        })

      } else {
        res.cc('数据表为空')
      }
    } catch (error) {
      res.cc('数据导入失败')
    }
  } else {
    res.cc('文件不能为空')
  }



}



exports.findAllGoodsList = async (req, res) => {
  try {


    const whereObj = {}

    for (let key in goodsConfig) {
      if (req.query[key]) {
        whereObj[key] = req.query[key]
      }
    }

    const goodsList = await Goods.findAll({
      limit: req.query.limit,
      offset: (req.query.page - 1) * req.query.limit,
      where: {
        ...whereObj
      }
    })

    const goodsCount = await Goods.count()


    res.send({
      status: 0,
      data: {
        goods_list: goodsList,
        count: goodsCount,
        page: parseInt(req.query.page),
        page_size: parseInt(req.query.limit)
      },
      message: '数据查询成功'
    })

  } catch (error) {
    res.cc('数据查询失败')
  }


}




exports.updateGoodById = async (req, res) => {

  const goodId = req.body.id

  const infoObj = {}


  for (let key in goodsConfig) {
    if (req.body[key]) {
      infoObj[key] = req.body[key]
    }
  }


  try {
    // await sequelize.sync()

    const goodInfo = await Goods.findAll({
      where: {
        id: goodId
      }
    })

    if (goodInfo.length > 0) {

      await goodInfo[0].update({
        ...infoObj
      })
      const savedData = await goodInfo[0].save()

      res.send({
        data: savedData,
        message: '查询成功',
        satus: 0
      })


    } else {
      res.cc('查询数据不存在')
    }


  } catch (error) {
    res.cc('数据查询失败')
  }
}




exports.findGoodByCode = async (req, res) => {
  const goodCode = req.query.good_code

  if (goodCode) {
    try {

      const goodInfo = await Goods.findAll({
        where: {
          good_code: goodCode
        }
      })

      if (goodInfo.length > 0) {

        res.send({
          data: goodInfo,
          message: '查询成功',
          satus: 0
        })


      } else {
        res.cc('查询数据不存在')
      }


    } catch (error) {
      res.cc('数据查询失败')
    }
  }

}


exports.delGoodById = async (req, res) => {
  const delGoodIds = req.body.ids
  try {
    if (delGoodIds && delGoodIds.length > 0) {

      let delCount = 0


      // await sequelize.sync()

      for (const id of delGoodIds) {
        const goodInfo = await Goods.findAll({
          where: {
            id
          }
        })
        if (goodInfo.length > 0) {
          await Goods.destroy({
            where: {
              id
            }
          })
          delCount++
        }

      }

      res.send({
        message: '数据删除成功',
        data: {
          del_count: delCount
        },
        satus: 0
      })




    }

  } catch (error) {
    res.cc('数据查询失败')
  }
}
