// const { app, BrowserWindow, ipcMain } = require("electron");
// const path = require("path");
// const fs = require("fs");

// let mainWindow;

// async function createWindow() {
//   // Create the browser window.
//   mainWindow = new BrowserWindow({
//     width: 1100,
//     height: 700,
//     minWidth: 1100,
//     minHeight: 700,
//     backgroundColor: "#1B2533",
//     show: true,
//     frame: false,

//     // webPreferences: {
//     //   nodeIntegration: false,
//     //   contextIsolation: true,
//     //   enableRemoteModule: false,

//     //   // Gets rid of warning message.
//     //   worldSafeExecuteJavaScript: true,

//     //   // Sandbox is enabled globally, this is just to make sure.
//     //   sandbox: true,
//     // },
//     webPreferences: {
//       nodeIntegration: false, // is default value after Electron v5
//       contextIsolation: true, // protect against prototype pollution
//       enableRemoteModule: false, // turn off remote
//       preload: path.join(__dirname, "preload.js"), // use a preload script
//     },
//   });

//   if (process.env.NODE_ENV === "production") {
//     mainWindow.loadFile("./build/index.html");
//   } else {
//     mainWindow.loadURL("http://localhost:8080");
//   }

//   // Open the DevTools.
//   mainWindow.webContents.openDevTools();
// }

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.whenReady().then(createWindow);

// // Quit when all windows are closed.
// app.on("window-all-closed", () => {
//   // On macOS it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("activate", () => {
//   // On macOS it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });

// ipcMain.on("toMain", (event, args) => {
//   console.log("testino");
//   fs.readFile("path/to/file", (error, data) => {
//     // Do something with file contents

//     // Send result back to renderer process
//     mainWindow.webContents.send("fromMain", path.join(__dirname, "preload.js"));
//   });
// });

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and require them
// ipcMain.handle("getIsWindowMaximized", () => {
//   return !mainWindow.maximizable;
// });

// // ipcMain.on("min-max-window", () => {
// //   console.log("pippo");
// //   if (mainWindow.isMaximized()) {
// //     mainWindow.unmaximize();
// //   } else {
// //     mainWindow.maximize();
// //   }
// // });

// ipcMain.on("minimize-window", () => {
//   mainWindow.minimize();
// });

// ipcMain.handle("quit-app", () => {
//   mainWindow.close();
//   mainWindow = null;
// });

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#1B2533",
    show: true,
    frame: false,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"), // use a preload script
    },
  });

  if (process.env.NODE_ENV === "production") {
    mainWindow.loadFile("./build/index.html");
  } else {
    mainWindow.loadURL("http://localhost:8080");
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Load app
  // mainWindow.loadFile(path.join(__dirname, "dist/index.html"));

  // rest of code..

  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("window-maximized");
  });

  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("window-minimized");
  });
}
app.on("ready", createWindow);

// ipcMain.on("toMain", (event, args) => {
//   fs.readFile("path/to/file", (error, data) => {
//     // Do something with file contents

//     // Send result back to renderer process
//     mainWindow.webContents.send("fromMain", "aaa");
//   });
// });

ipcMain.handle("minimize-window", (event, args) => {
  mainWindow.minimize();
});

ipcMain.handle("quit-app", () => {
  mainWindow.close();
  mainWindow = null;
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
