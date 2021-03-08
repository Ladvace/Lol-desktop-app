const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const https = require("https");
const LCUConnector = require("lcu-connector");
const RiotWSProtocol = require("./src/utils/webSocketLCU");

const connector = new LCUConnector();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 600,
    height: 700,
    minWidth: 600,
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

ipcMain.handle("minimize-window", (event, args) => {
  mainWindow.minimize();
});

app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
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

let actionNum = undefined;
let port = undefined;
let token = undefined;

const agent = new https.Agent({
  rejectUnauthorized: false,
});

ipcMain.handle("lockChamp", (champId) => {
  const config = {
    method: "get",
    httpsAgent: agent,
    url: `https://127.0.0.1:62336/lol-champ-select/v1/session/actions/${actionNum}`,

    headers: {
      Accept: "application/json",
      Authorization: `Basic ${token}`,
    },
    body: {
      actorCellId: 0,
      championId: actionNum,
      completed: true,
      id: actionNum,
      isAllyAction: true,
      type: "string",
    },
  };

  
});

// league of legends stuff (lcu, ws...)

connector.on("connect", (data) => {
  console.log(JSON.stringify(data));

  //  {
  //    address: '127.0.0.1'
  //    port: 18633,
  //    username: 'riot',
  //    password: H9y4kOYVkmjWu_5mVIg1qQ,
  //    protocol: 'https'
  //  }

  token = Buffer.from(`riot:${data.password}`).toString("base64");

  port = data.port;

  const ws = new RiotWSProtocol(
    `wss://riot:${data.password}@localhost:${data.port}/`
  );

  ws.on("open", () => {
    ws.subscribe("OnJsonApiEvent", (e) => {
      switch (e.uri) {
        case "/lol-matchmaking/v1/search": {
          switch (e.eventType) {
            case "Create":
              mainWindow.webContents.send("startSearchingGame", e);
            case "Update":
              break;
            case "Delete":
              mainWindow.webContents.send("stopSearchingGame", e);
              break;
            default:
              break;
          }
          break;
        }
        case "/lol-matchmaking/v1/ready-check": {
          // console.log(e);
          switch (e.eventType) {
            case "Update": {
              if (e.data.playerResponse === "Accepted") {
                mainWindow.webContents.send("Accepted", e);
              } else if (e.data.playerResponse === "Declined")
                mainWindow.webContents.send("Declined", e);
              break;
            }

            default:
              break;
          }

          break;
        }
        case "/lol-champ-select/v1/session": {
          switch (e.eventType) {
            case "Update": {
              console.log(
                "actioId",
                e.data.actions[0],
                e.data.actions[0].filter((x) => x.type === "pick")[0].id
              );
              mainWindow.webContents.send("joinedChampSelect", e);
              actionNum = e.data.actions[0].filter((x) => x.type === "pick")[0]
                .id;
              break;
            }
            case "Delete": {
              mainWindow.webContents.send("quittedChampSelect", e);
              break;
            }

            default:
              break;
          }

          break;
        }

        default:
          break;
      }
    });

    // ws.subscribe("OnJsonApiEvent_lol-matchmaking_v1_search", (e) => {
    //   mainWindow.webContents.send("startSearchingGame", e);
    //   if (e?.eventType === "Delete")
    //     mainWindow.webContents.send("stopSearchingGame", e);
    // });
    // // ws.subscribe("OnJsonApiEvent_lol-champ-select-legacy_v1_session", (e) => {
    // ws.subscribe("OnJsonApiEvent_lol-champ-select_v1_grid-champions", (e) => {
    //   console.log("ciao");
    // });
  });
});

// Start listening for the LCU client
connector.start();
