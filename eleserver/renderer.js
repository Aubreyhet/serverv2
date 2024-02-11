const { contextBridge, ipcRenderer } = require('electron')

// ipcRenderer.on('mainToRender_Update', (event, message) => {
//   console.log(message);
// });



// ipcRenderer.send('renderToMain_other', 'Hello from renderer process!');




// const handleSend = async (cb) => {
//   const mainreturndata = await ipcRenderer.invoke('send-event')
//   cb(mainreturndata)
// }


contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  setAutoDate: async (v) => await ipcRenderer.invoke('set-autoupdate', v),
  checkUpdate: () => ipcRenderer.invoke('check-update'),
  updateEvent: (v) => ipcRenderer.invoke('update-event', v),
  onUpdateCounter: (cb) => ipcRenderer.on('update-counter', cb)
})

