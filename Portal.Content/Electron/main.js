const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const fs = require("fs");
const { net } = require('electron')
// const fetch = require('electron-main-fetch');
const fetch = require('node-fetch');

const Store = require('./store.js');
var wifi = require("node-wifi");



const { Menu } = require('electron');
const template = [
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
];
let mainWindow;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {

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


  // wifi.init({ iface: null });
  // wifi.scan(function (err, networks) {
  //   console.log(networks);
  //   mainWindow.webContents.executeJavaScript('localStorage.setItem("wifis",JSON.stringify(' + JSON.stringify(networks) + '));', true)
  // });

  // mainWindow.webContents.executeJavaScript('localStorage.getItem("SSID");', true)
  //   .then((result) => {
  //     console.log(result);
  //     mainWindow.webContents.executeJavaScript('localStorage.getItem("Password");', true)
  //       .then((result2) => {
  //         console.log(result2);
  //         wifi.connect({ ssid: result, password: result2 }, function (err) {
  //           if (err) {
  //             console.log(err);
  //           } else
  //             console.log("Connected");
  //         });
  //       })
  //   })

  mainWindow.loadURL('https://content.boykaf.xyz/');
  //mainWindow.loadURL('http://localhost:3000/');
  mainWindow.reload();
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

app.on('web-contents-created', (e, contents) => {
  e.preventDefault();
  if (contents.getType() == 'webview') {
    contents.on('new-window', (e, url) => {
      e.preventDefault();

      let child = new BrowserWindow({ parent: mainWindow, width: 900, height: 900, modal: true, show: false, isNormal: true, fullscreen: false, fullscreenable: false, });
      child.loadURL(url);
      child.once('ready-to-show', () => {
        child.show();
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


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  data = {
    bounds: mainWindow.getBounds()
  };
  app.quit();
});
