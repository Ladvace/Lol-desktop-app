const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#1B2533",
    icon: `${__dirname}/assets/app.ico`,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:8082/");
  } else {
    mainWindow.loadURL(`file://${__dirname}/index.html`);
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  //wait until webpack build html page
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    if (process.platform !== "darwin") {
      app.quit();
    }
    mainWindow = null;
  });

  if (isDev) {
    const {
      REACT_DEVELOPER_TOOLS,
      default: installExtension,
    } = require("electron-devtools-installer");
    installExtension(REACT_DEVELOPER_TOOLS).then(() => {
      mainWindow.webContents.openDevTools();
    });

    globalShortcut.register("CommandOrControl+R", () => {
      mainWindow.reload();
    });
  }

  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("window-maximized");
  });

  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("window-minimized");
  });
}

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("get-result", (event, arg) => {
  event.returnValue = `electron-${arg.name}`;
});

ipcMain.handle("getIsWindowMaximized", () => {
  return !mainWindow.maximizable;
});

ipcMain.handle("min-max-window", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle("minimize-window", () => {
  mainWindow.minimize();
});

ipcMain.handle("quit-app", () => {
  mainWindow.close();
  mainWindow = null;
});
