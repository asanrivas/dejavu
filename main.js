// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
      plugins: false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.webContents.openDevTools()

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.webContents.on("did-finish-load", () => {
    console.log("rendered ok");
    mainWindow.webContents.send("render-pdf");
    ipcMain.once("render-finish", () => {
        console.log("rendered pdf done");
        mainWindow.webContents.print(
            {
                deviceName: "DYMO_LabelWriter_450",
                margins: {
                    marginType: "custom",
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5
                },
                silent: true,
                landscape: true,
                pageSize: {
                    width: 54975,
                    height: 70850
                }
            },
            (success, errorType) => {
                if (!success) {console.log(errorType);
            }
        );
    });
});
}

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


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
