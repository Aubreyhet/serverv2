
const fs = require('fs')
const xlsx = require('xlsx');
const path = require('path')

/**
 * 
 * @returns 当天0点时间戳
 */
exports.getTimestamp = () => {
  const now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  const zeroTimeTimestamp = now.getTime();
  return zeroTimeTimestamp
}

exports.getParserTime = () => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}${month}${day}`;
  return formattedDate
}

exports.writeDataToFile = async (filename, type, data, table_header) => {
  const filePath = path.join(__dirname, `../public/download/${filename}`);
  const resFilePath = `/download/${filename}`
  if (type === 'json') {
    await fs.writeFileSync(filePath, JSON.stringify(data))
    return resFilePath
  } else if (type === 'csv') {

    const header = Object.values(table_header);

    const goodsData = [[' ', ...header], ...data.map(good => Object.values(good.dataValues))]

    const workbook = xlsx.utils.book_new();


    const worksheet = xlsx.utils.aoa_to_sheet(goodsData);

    xlsx.utils.book_append_sheet(workbook, worksheet, 'table1');


    xlsx.writeFile(workbook, filePath);

    return resFilePath


  } else if (type === 'sql') {

  } else if (type === 'xlsx') {

    const header = Object.values(table_header);

    const table1 = [[' ', ...header], ...data.map(good => Object.values(good.dataValues))]

    const workbook = xlsx.utils.book_new();


    const worksheet = xlsx.utils.aoa_to_sheet(goodsData);

    xlsx.utils.book_append_sheet(workbook, worksheet, 'GoodsData');


    xlsx.writeFile(workbook, filePath);
    return resFilePath

  }
}

