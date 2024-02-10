// const fs = require('fs');
// const path = require('path');
const { CronJob } = require('cron');


// const cleanUpJob = new cron.CronJob('0 0 */2 * * *', async () => {
//   const publicPath = path.join(__dirname, 'public/download');

//   console.log('-------------清理定时任务开启------------------')

//   try {
//     const files = await fs.promises.readdir(publicPath);

//     files.forEach(async (file) => {
//       const filePath = path.join(publicPath, file);
//       const { birthtime } = await fs.promises.stat(filePath);
//       const timeDifference = Date.now() - birthtime.getTime();
//       const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;

//       if (timeDifference > twoHoursInMilliseconds) {
//         await fs.promises.unlink(filePath);
//         console.log(`Deleted file: ${file}`);
//       }
//     });
//   } catch (error) {
//     console.error('Error cleaning up files:', error.message);
//   }
// });

// cleanUpJob.start();


class CronJobs {
  //启动定时任务
  static async CronJobsStart () {
    try {
      await CronJobs.TestDCronJob()
    } catch (e) {
      logger.debug(e);
    }
  }

  //定时任务
  static async TestDCronJob () {
    const rule = '*/5 * * * * *'        //cron表达式,每5s执行一次
    new CronJob(rule, function () {
      console.log('CronJob Test')
      // logger.debug(`${rule} CronJob Test`)
      // logger.getLogger
    }).start()
  }
}

CronJobs.CronJobsStart()


// module.exports = CronJobs
