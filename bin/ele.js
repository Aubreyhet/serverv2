// Modules to control application life and create native browser window
const expApp = require('./app');
const http = require('http');


const { app, BrowserWindow, autoUpdater } = require('electron')


const port = normalizePort(process.env.PORT || '8010');
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



function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  })
  mainWindow.removeMenu();
  mainWindow.loadURL(`http://localhost:${port}`);
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})



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

