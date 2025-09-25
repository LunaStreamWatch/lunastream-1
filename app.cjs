const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    icon: "favicon-large.ico",
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173'); // vite dev server
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html')); // vite build output
  }
}

app.whenReady().then(createWindow);
