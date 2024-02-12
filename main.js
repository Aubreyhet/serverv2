// Modules to control application life and create native browser window
const http = require('http');
const fs = require('fs');
const path = require('node:path')

const expApp = require('./app');
const checkUpdate = require('./eleserver/update.js');


const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron')


const port = normalizePort('8010');
expApp.set('port', port);

const server = http.createServer(expApp);

// 启动 Express 应用程序
server.listen(port);

server.on('error', onError);

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
});



const createWindow = () => {


  let mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 1024,
    minHeight: 768,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(__dirname, './eleserver/renderer.js')
    },
  })



  // 设置快捷键开启开发者工具
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow.webContents.openDevTools();
  });


  // 加载页面窗口文件
  // mainWindow.loadURL(`http://localhost:${port}`);
  mainWindow.loadURL(`http://localhost:3000`);


  mainWindow.webContents.on('dom-ready', () => {
    console.log('--------------------------->>      dom-ready')
  })

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('--------------------------->>      did-finish-load')
  })

  ipcMain.handle('set-autoupdate', (e, m) => {
    checkUpdate(mainWindow, ipcMain, m);
  })




  mainWindow.on('close', () => {
    console.log('--------------------------->>      close')
  })
}


app.on('ready', () => {
  console.log('--------------------------->>      ready')
  checkDabaBase()
  createWindow()
  app.on('activate', function () {
    console.log('----------->>      ready   ------------------->>    activate')
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', function () {
  console.log('--------------------------->>      window-all-closed')
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  console.log('--------------------------->>      before-quit')
});

app.on('will-quit', () => {
  console.log('--------------------------->>      will-quit ---- 1')
  globalShortcut.unregisterAll();
});


app.on('quit', () => {
  console.log('--------------------------->>      quit')
});

const checkDabaBase = () => {
  const appPath = app.getAppPath();
  const dbFolderPath = path.join(appPath, 'db');
  const dbFilePath = path.join(dbFolderPath, 'cashier_pro.sqlite3');
  const backupFilePath = path.join(app.getPath('userData'), 'backup_cashier_pro.sqlite3')
  try {
    if (!fs.existsSync(dbFilePath)) {
      if (!fs.existsSync(dbFolderPath)) {
        fs.mkdirSync(dbFolderPath, { recursive: true });
      }
      if (fs.existsSync(backupFilePath)) {
        fs.copyFileSync(backupFilePath, dbFilePath)
      }
    }
  } catch (error) {
    console.log(error)
  }

}



function normalizePort (val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

