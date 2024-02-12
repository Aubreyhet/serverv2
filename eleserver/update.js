const { app } = require('electron');
const { autoUpdater } = require('electron-updater');
const fs = require('fs');
const path = require('path');
let mainWin = null;



const dbFilePath = 'db/cashier_pro.sqlite3';
const backupFilePath = path.join(app.getPath('userData'), 'backup_cashier_pro.sqlite3');



const checkUpdate = async (win, ipcMain, auto) => {
  mainWin = win

  autoUpdater.forceDevUpdateConfig = true
  autoUpdater.autoDownload = false; // 自动下载




  if (auto === '1') {
    autoUpdater.checkForUpdates()
  }

  ipcMain.handle('check-update', () => {
    autoUpdater.checkForUpdates()
  })


  let updateMode = null

  ipcMain.handle('update-event', async (e, v) => {
    updateMode = v
    if (updateMode === 1) {
      // 立即更新
      try {
        backupDatabase()
        await autoUpdater.downloadUpdate()
      } catch (error) {
        console.log(error)
        mainToRender_Update({
          event: 'error',
          message: new Error(error)
        })
      }

      // 更新操作
    } else if (updateMode === 0) {
      // 后台更新
      try {
        backupDatabase()
        await autoUpdater.downloadUpdate()

      } catch (error) {
        console.log(error)
        mainToRender_Update({
          event: 'error',
          message: new Error(error)
        })
      }
      // 更新操作
    }
  })






  // autoUpdater.autoDownload = true; // 自动下载
  // autoUpdater.autoInstallOnAppQuit = true; // 应用退出后自动安装




  // autoUpdater.checkForUpdatesAndNotify().catch();


  // 监听渲染进程的 install 事件，触发退出应用并安装
  // ipcMain.handle('install', () => autoUpdater.quitAndInstall());


  autoUpdater.on('appimage-filename-updated', (message) => {
    mainToRender_Update({
      event: 'appimage-filename-updated',
      message
    })
  })

  autoUpdater.on('checking-for-update', (message) => {
    mainToRender_Update({
      event: 'checking-for-update',
      message
    })
  });

  autoUpdater.on('download-progress', (message) => {
    if (updateMode === 1) {
      mainToRender_Update({
        event: 'download-progress',
        message
      })
    }

  })

  autoUpdater.on('error', (message) => {
    mainToRender_Update({
      event: 'error',
      message
    })
  })

  autoUpdater.on('login', (message) => {
    mainToRender_Update({
      event: 'login',
      message
    })
  })

  autoUpdater.on('update-available', (message) => {
    mainToRender_Update({
      event: 'update-available',
      message
    })
  })

  autoUpdater.on('update-cancelled', (message) => {
    mainToRender_Update({
      event: 'update-cancelled',
      message
    })
  })


  autoUpdater.on('update-downloaded', (message) => {
    if (updateMode === 1) {
      // 立即更新的话 下载完成之后通知渲染进程 是否重启安装
      mainToRender_Update({
        event: 'update-downloaded',
        message
      })
      ipcMain.handle('update-event', (e, v) => {
        if (v === 1) {
          autoUpdater.quitAndInstall()
        } else if (v === 0) {
          app.on('will-quit', () => {
            autoUpdater.quitAndInstall()
          })
        }
      })
    } else if (updateMode === 0) {
      app.on('will-quit', () => {
        autoUpdater.quitAndInstall()
      })
    }
  })

  autoUpdater.on('update-not-available', (message) => {
    mainToRender_Update({
      event: 'update-not-available',
      message
    })
  });



};


const mainToRender_Update = (context) => {
  mainWin.webContents.send('update-counter', context)
}

// const duplexSession = () => {
//   ipcMain.handle('invoke-function', async (event, arg) => {
//     // do something
//     return result;
//   })
// }

const backupDatabase = () => {
  fs.copyFileSync(dbFilePath, backupFilePath);
}


// const restoreDatabase = () => {
//   fs.copyFileSync(backupFilePath, dbFilePath)
// }

module.exports = checkUpdate;



// const checkUpdateV2 = (window, feedUrl) => {
//   mainWin = window;
//   let message = {
//     error: '检查更新出错',
//     checking: '正在检查更新……',
//     updateAva: '检测到新版本，正在下载……',
//     updateNotAva: '现在使用的就是最新版本，不用更新',
//   };

//   autoUpdater.autoDownload = false; //取消自动下载
//   //设置更新包的地址
//   autoUpdater.setFeedURL(feedUrl);
//   //监听升级失败事件
//   autoUpdater.on('error', function (error) {
//     sendUpdateMessage({
//       cmd: 'error',
//       message: message.error
//     })
//   });
//   //监听开始检测更新事件
//   autoUpdater.on('checking-for-update', function (message) {
//     sendUpdateMessage({
//       cmd: 'checking-for-update',
//       message: message.message
//     })
//   });
//   //监听发现可用更新事件
//   autoUpdater.on('update-available', function (message) {
//     sendUpdateMessage({
//       cmd: 'update-available',
//       message: message.message
//     })
//     //新加内容
//     /**	`const options = {
//         type: 'info',
//         buttons: ['确定', '取消'],
//         title: '更新提示',
//         message: message.'发现有新版本，是否更新？',
//         cancelId: 1
//       }
//       dialog.showMessageBox(options).then(res => {
//         if (res.response === 0) {
//           sendUpdateMessage({
//             cmd: 'confimUpdate',
//             message: message.message
//           })
//           autoUpdater.downloadUpdate()
//         } else {
//           return;
//         }
//       })`*/




//   });
//   //监听没有可用更新事件
//   autoUpdater.on('update-not-available', function (message) {
//     sendUpdateMessage({
//       cmd: 'update-not-available',
//       message: message.message
//     })
//   });

//   // 更新下载进度事件
//   autoUpdater.on('download-progress', function (progressObj) {
//     sendUpdateMessage({
//       cmd: 'download-progress',
//       message: message.progressObj
//     })
//   });
//   //监听下载完成事件
//   autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl) {
//     sendUpdateMessage({
//       cmd: 'update-downloaded',
//       message: {
//         releaseNotes,
//         releaseName,
//         releaseDate,
//         updateUrl
//       }
//     })
//     //退出并安装更新包
//     //autoUpdater.quitAndInstall();
//   });
//   //新增
//   ipcMain.on("quit-install", (e, arg) => {
//     autoUpdater.quitAndInstall();
//   })
//   //接收渲染进程消息，开始检查更新
//   ipcMain.on("checkForUpdate", (e, arg) => {
//     //执行自动更新检查
//     // sendUpdateMessage({cmd:'checkForUpdate',message:arg})
//     autoUpdater.checkForUpdates();
//   })
// }
// //给渲染进程发送消息
// function sendUpdateMessage (text) {
//   mainWin.webContents.send('message', text)
// }


















