
const fs = require('fs')
const iconv = require('iconv-lite')
const xlsx = require('xlsx');
// const path = require('path')
const { goodsConfig } = require('../config/goodsconfis')

const { Goods, Sequelize } = require('../models')
const { Op } = Sequelize


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

        fs.unlink(`uploads/${req.file.filename}`, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          } else {
            console.log('File deleted successfully');
          }
        });

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
        whereObj[key] = {
          [Op.like]: `%${req.query[key]}%`,
        }
      }
    }

    const goodsList = await Goods.findAll({
      limit: req.query.limit,
      offset: (req.query.page - 1) * req.query.limit,
      where: {
        ...whereObj
      }
    })

    const goodsCount = await Goods.count({
      where: {
        ...whereObj
      }
    })


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
        message: '更新成功',
        satus: 0
      })


    } else {
      res.cc('数据更新失败')
    }


  } catch (error) {
    res.cc('数据查询失败')
  }
}


exports.findGoodByCode = async (req, res) => {
  const goodCode = req.query.good_code
  const nonNegative = req.query.non_negative

  if (goodCode) {
    let goodInfo = null
    try {
      goodInfo = await Goods.findAll({
        where: {
          good_code: {
            [Op.like]: `%${goodCode}%`,
          },
        }
      })

      if (goodInfo.length < 1) {
        goodInfo = await Goods.findAll({
          where: {
            good_name: {
              [Op.like]: `%${goodCode}%`,
            },
          }
        })
      }

      console.log(goodInfo.length)


      if (goodInfo.length === 1) {
        if (parseInt(nonNegative) === 1 && goodInfo[0].good_stock < 1) {
          res.cc('库存不足')
        } else {
          res.send({
            data: goodInfo,
            message: '查询成功',
            satus: 0
          })
        }

      } else if (goodInfo.length > 1) {

        if (parseInt(nonNegative) === 1) {
          res.send({
            data: goodInfo.filter(i => i.good_stock > 0),
            message: '查询成功',
            satus: 0
          })
        } else {
          res.send({
            data: goodInfo,
            message: '查询成功',
            satus: 0
          })
        }
      } else {
        res.cc('查询商品不存在')
      }
    } catch (error) {
      console.log(error)
      res.cc(error)
    }
  }

}


exports.delGoodById = async (req, res) => {
  const delGoodIds = req.body.ids
  try {
    if (delGoodIds && delGoodIds.length > 0) {

      let delCount = 0

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
    console.log(error)
    res.cc('数据删除失败')
  }
}


exports.exportFiles = async (req, res) => {

  // const fileType = req.query.file_type || 'csv'
  const fileType = 'csv'
  const file_name = `${Date.now()}.${fileType}`

  try {
    const whereObj = {}

    for (let key in goodsConfig) {
      if (req.query[key]) {
        whereObj[key] = {
          [Op.like]: `%${req.query[key]}%`,
        }
      }
    }
    const resData = await Goods.findAll({
      where: {
        ...whereObj
      }
    })
    // const download_file_url = await writeDataToFile(file_name, fileType, resData, goodsConfig)
    // res.send({
    //   data: {
    //     download_file_url,
    //     file_name
    //   },
    //   status: 0,
    //   message: '文件生成成功！'
    // })

    const header = Object.values(goodsConfig);
    const goodsData = [[' ', ...header], ...resData.map(good => Object.values(good.dataValues))]
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(goodsData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${file_name}"`);
    const fileBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'csv' });
    res.send(fileBuffer);
  } catch (error) {
    console.log(error)
    res.cc('数据查询失败')
  }
}


exports.findFilterOptions = async (req, res) => {
  // store: '仓店',
  // shape_code: '款式编码',
  // good_code: '商品编码',
  // good_name: '商品名',
  // good_color_norm: '颜色及规格',
  // good_brand: '品牌',

  const fields = ['store', 'shape_code', 'good_code', 'good_name', 'good_color_norm', 'good_brand']
  const filterOptions = {}
  try {
    for (const item of fields) {
      let fieldOptions = await Goods.findAll({
        attributes: [item],
        group: [item],
        raw: true
      });
      filterOptions[item] = fieldOptions.map(option => option[item])
    }
    res.send({
      data: filterOptions,
      status: 0,
      message: '筛选参数查询成功'
    })

  } catch (error) {
    console.log(error)
    res.cc('数据查询失败')
  }
};
