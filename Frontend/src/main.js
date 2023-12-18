const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const io = require("socket.io-client");
const path = require("path");

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
        { role: "reload" },
        { role: "forcereload" },
        { type: "separator" },
        { role: "toggledevtools" },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);

  win.loadFile("./app/index.html");

  // Connect to the socket server
  socket = io("http://localhost:3000");

  socket.on("receive-message", (data) => {
    // Send the received message to the renderer process
    win.webContents.send("receive-message", data);
  });

  ipcMain.on("send-to-server", (event, data) => {
    socket.emit("send-message", data);
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
