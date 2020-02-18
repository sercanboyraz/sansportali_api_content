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

function setMainMenu() {
  const template = [
    {
      label: 'Wifi',
      submenu: [
        {
          label: 'Wifi Listesi',
          click() {
            mainWindow.webContents.executeJavaScript('localStorage.setItem("wifiopen",true);', true);
          }
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
let mainWindow;
let child;

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
  // const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(null);
  mainWindow.webContents.executeJavaScript('localStorage.getItem("SSID");', true)
    .then((result) => {
      mainWindow.webContents.executeJavaScript('localStorage.getItem("Password");', true)
        .then((result2) => {
          wifi.connect({ ssid: result, password: result2 },
            function (err) {
              if (err) {
                console.log(err);
                setMainMenu();
              } else {
                console.log("Connected");
              }
            });
        })
    })

  mainWindow.loadURL('https://boykaf.xyz/');
  //mainWindow.loadURL('http://localhost:3000/');
  mainWindow.reload();
  // const menu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('maximizable', function (event) {
    if (!application.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }

    return false;
  });
}

ipcMain.handle('get-wifi-names', async (event, someArgument) => {
  console.log("get-wifi-names") // prints "ping"
  var resultData = await wifi.scan().then((function (networks) {
    // console.log(networks);
    mainWindow.webContents.executeJavaScript('localStorage.setItem("wifis",JSON.stringify(' + JSON.stringify(networks) + '));')
    return networks;
  }));
  return resultData;
})

ipcMain.handle('menu_clear', async (event, someArgument) => {
  Menu.setApplicationMenu(null);
  return "";
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

ipcMain.handle('close-button', async (event, someArgument) => {
  child.close();
  return "";
})

ipcMain.handle('shutdown_event', async (event, someArgument) => {
  shutdown.shutdown();
  return "";
})

app.on('web-contents-created', (e, contents) => {
  e.preventDefault();
  if (contents.getType() == 'webview') {
    contents.on('new-window', (e, url) => {
      e.preventDefault();
      if (!child) {
        child = new BrowserWindow({
          parent: mainWindow,
          width: 1150, height: 900, modal: true, show: false,
          isNormal: true, fullscreen: false, fullscreenable: false,
          minimizable: false, maximizable: false, closable: true,
          center: true, darkTheme: true, kiosk: true, frame: false,
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
        });
        //`file://${__dirname}/index.html`
        // child.webContents.openDevTools();

        child.loadURL(`file://${__dirname}/index.html`);

        child.once('ready-to-show', () => {
          child.show();
        });
        child.on('closed', () => {
          child = null;
        });
        child.webContents.executeJavaScript('localStorage.setItem("url",' + JSON.stringify(url) + ');', true);
        fetch('https://boykaf.xyz/css.json')
          .then(res => res.text())
          .then(json => {
            child.webContents.once('dom-ready', function () {
              child.webContents.insertCSS(json);
            });
          });
        e.preventDefault();
      }
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
