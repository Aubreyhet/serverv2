


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

