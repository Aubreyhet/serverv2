const { ipcRenderer } = require('electron');


ipcRenderer.on('mainToRender_Update', (event, message) => {
  console.log(message);
});



// ipcRenderer.send('renderToMain_other', 'Hello from renderer process!');
