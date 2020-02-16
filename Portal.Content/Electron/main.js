const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const fs = require("fs");
const { net, ipcMain, Menu } = require('electron')
const fetch = require('node-fetch');
var wifi = require("node-wifi");
const shutdown = require('electron-shutdown-command');

const template = [
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' }
    ]
  }
];
let mainWindow;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.

function createWindow() {

  mainWindow = new BrowserWindow({
    // width: 1024,
    // height: 768,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
    titleBarStyle: 'hidden',
    backgroundColor: '#fff',
    webPreferences: {
      // nodeIntegration: true,
      webviewTag: true,
      zoomFactor: 1.0,
      blinkFeatures: 'OverlayScrollbars',
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      nativeWindowOpen: true,
      allowRunningInsecureContent: true,
      scrollBounce: true,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
    },
    fullscreen: true,
    isFullScreen: true,
    isFullScreenable: true,
    isKiosk: true,
  });


  wifi.init({ iface: null });

  wifi.scan().then(function (networks) {
    mainWindow.webContents.executeJavaScript('localStorage.setItem("wifis",JSON.stringify(' + JSON.stringify(networks) + '));', true)
    console.log(networks);
  })

  mainWindow.webContents.executeJavaScript('localStorage.getItem("SSID");', true)
    .then((result) => {
      mainWindow.webContents.executeJavaScript('localStorage.getItem("Password");', true)
        .then((result2) => {
          wifi.connect({ ssid: result, password: result2 }, function (err) {
            if (err) {
              console.log(err);
            } else
              console.log("Connected");
          });
        })
    })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }
  // mainWindow.loadURL('https://content.boykaf.xyz/');
  mainWindow.loadURL('http://localhost:3000/');
  mainWindow.reload();
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null
  })

}


ipcMain.handle('get-wifi-names', async (event, someArgument) => {
  console.log("get-wifi-names") // prints "ping"
  var resultData = await wifi.scan().then((function (networks) {
    console.log(networks);
    mainWindow.webContents.executeJavaScript('localStorage.setItem("wifis",JSON.stringify(' + JSON.stringify(networks) + '));')
    return networks;
  }));
  return resultData;
})

ipcMain.handle('set-wifi-names', async (event, someArgument) => {
  mainWindow.webContents.executeJavaScript('localStorage.getItem("SSID");', true)
    .then((result) => {
      console.log(result);
      mainWindow.webContents.executeJavaScript('localStorage.getItem("Password");', true)
        .then((result2) => {
          console.log(result2);
          wifi.connect({ ssid: result, password: result2 }, function (err) {
            if (err) {
              console.log(err);
            } else
              console.log("Connected");
          });
        })
    })
  return "";
})

ipcMain.handle('shutdown_event', async (event, someArgument) => {
  shutdown.shutdown();
  return "";
})

app.on('web-contents-created', (e, contents) => {
  e.preventDefault();
  let child;
  if (contents.getType() == 'webview') {
    contents.on('new-window', (e, url) => {
      e.preventDefault();

      child = new BrowserWindow({ parent: mainWindow, width: 900, height: 900, modal: true, show: false, isNormal: true, fullscreen: false, fullscreenable: false, minimizable: false, maximizable: false });
      child.loadURL(url);
      child.once('ready-to-show', () => {
        try {
          child.show();
        }
        catch{

        }
      });

      fetch('https://content.boykaf.xyz/css.json')
        .then(res => res.text())
        .then(json => {
          child.webContents.once('dom-ready', function () {
            child.webContents.insertCSS(json);
          });
        });
      e.preventDefault();
    })
  }
})

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  data = {
    bounds: mainWindow.getBounds()
  };
  app.quit();
});


app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
