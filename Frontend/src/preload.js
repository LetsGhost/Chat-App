const { channel } = require("diagnostics_channel");
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  login: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  connect: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  userConnected: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  userDisconnected: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});
