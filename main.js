// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    frame: false,
    minWidth: 800,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    
  })
  

 
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  ipcMain.on("toMain", (event, args) => {
    // Events from renderer process
    console.info("toMain args ", args)

    // For toolbar buttons.
    if (args === "maximize") {
      if ( mainWindow.isMaximized() ) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    } else if (args === "minimize" ) {
      mainWindow.minimize();
    } else if ( args === "close" ) {
      mainWindow.close();
    }
    mainWindow.webContents.send("fromMain", args);
  });

  // mainWindow.webContents.openDevTools()
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('synchronous-message', function(event, arg) {
  console.log(arg);  // prints "ping"
  event.returnValue = 'pong';
  console.log('return value was set');
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

