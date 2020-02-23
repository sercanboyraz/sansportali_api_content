const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const { ipcMain, Menu } = require('electron')
const fetch = require('node-fetch');
const shutdown = require('electron-shutdown-command');
const isOnline = require('is-online');

function setMainMenu() {
  const template = [
    {
      label: 'Menü',
      submenu: [
        {
          label: 'Yenile',
          click() {
            mainWindow.webContents.reload();
            isOnline().then(result => {
              if (!result) {
                console.log("yok");
                mainWindow.maximize();
                mainWindow.setFullScreen(false);
              }
              else {
                console.log("var");
                mainWindow.setFullScreen(true);
                Menu.setApplicationMenu(null);
              }
            });
          }
        },
        {
          label: 'Kapat',
          click() {
            shutdown.shutdown();
          }
        },
        { role: 'toggledevtools' }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

let mainWindow;
let child;

function createWindow() {

  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'sander64x64.png'),
    titleBarStyle: 'hidden',
    backgroundColor: '#fff',
    webPreferences: {
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
    maximizable: false,
    minimizable: false,
    simpleFullscreen: true,
    isFullScreen: true,
    isFullScreenable: true,
    isKiosk: true,
    enableLargerThanScreen: true,
  });

  isOnline().then(result => {
    if (!result) {
      mainWindow.maximize();
      mainWindow.setFullScreen(false);
      setMainMenu();
    }
    else {
      mainWindow.setFullScreen(true);
      // Menu.setApplicationMenu(null);
    }
  })
  setMainMenu();

  //mainWindow.loadURL('https://boykaf.xyz/');
  mainWindow.loadURL('http://localhost:3000/');
}
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
          mainWindow.webContents.executeJavaScript('document.body.style.pointerEvents = "auto";', true);
          child = null;
        });

        mainWindow.webContents.executeJavaScript('document.body.style.pointerEvents = "none";', true);

        child.webContents.executeJavaScript('localStorage.setItem("url",' + JSON.stringify(url) + ');', true);
        fetch('https://boykaf.xyz/css.json')
          .then(res => res.text())
          .then(json => {
            if (child && child.webContents) {
              child.webContents.once('dom-ready', function () {
                child.webContents.insertCSS(json);
              });
            }
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

ipcMain.handle('main-url', async (event, someArgument) => {
  mainWindow.loadURL('https://boykaf.xyz/');
  mainWindow.reload();
  return "";
})

ipcMain.handle('menu_clear', async (event, someArgument) => {
  Menu.setApplicationMenu(null);
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

ipcMain.handle('refresh-internet', async (event, someArgument) => {
  isOnline().then(result => {
    if (!result) {
      console.log("2" + result);
      mainWindow.maximize();
      mainWindow.setFullScreen(false);
      setMainMenu();
      mainWindow.maximize();
    }
    else {
      console.log("1" + result);
      mainWindow.setFullScreen(true);
      Menu.setApplicationMenu(null);
    }
  });
})


ipcMain.handle('otherlink', async (event, someArgument) => {
  return child ? true : false;
})