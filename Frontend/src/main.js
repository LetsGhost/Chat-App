const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const io = require("socket.io-client");
const path = require("path");
const axios = require("axios");

const Store = require("electron-store");
const store = new Store();

let socket;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  const menu = Menu.buildFromTemplate([
    {
      label: "Dev Tools",
      submenu: [
        { 
          label: "Reload",
          shortcut: "F11",
          click: () => {
            socket.disconnect();
            win.reload();
          }
        },
        { role: "toggledevtools" },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);

  win.loadFile("./app/index.html");

  // Connect to server
  ipcMain.on("connect", (event, data) => {
    try{
        console.log("Connecting to server");
        const token = store.get("token");
        socket = io("http://localhost:3000", {
          query: { token },
        })

        socket.on("receive-message", (data) => {
          win.webContents.send("receive", data);
        })
    } catch (err) {
        console.log(err);
    }
  });

  // Send message to server
  ipcMain.on("send-to-server", (event, data) => {
    socket.emit("send-message", data);
  });

  // Login
  ipcMain.on("login", (event, data) => {
    axios
      .post("http://localhost:3000/api/login", {
        username: data.username,
        password: data.password,
      })
      .then((res) => {
        console.log("Logged in successfully");
        store.set("token", res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
