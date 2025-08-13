// electron.cjs updated with env for CONFIG_DIR and BACKUP_DIR
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { execFile } = require('child_process');
const http = require('http');
const fs = require('fs').promises;
const fsSync = require('fs');
let mainWindow;
let flaskProcess = null;
let mongoProcess = null;
function logToFile(message) {
  const timestamp = new Date().toISOString();
  fsSync.appendFileSync(path.join(app.getPath('userData'), 'app.log'), `${timestamp}: ${message}\n`, 'utf8');
}
const originalConsoleLog = console.log;
console.log = (...args) => {
  logToFile(args.join(' '));
  originalConsoleLog(...args);
};
const originalConsoleError = console.error;
console.error = (...args) => {
  logToFile(`ERROR: ${args.join(' ')}`);
  originalConsoleError(...args);
};
function isFlaskServerRunning() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://127.0.0.1:5000/', { timeout: 5000 }, (res) => {
      if (res.statusCode === 200) resolve(true);
      else reject(new Error(`Flask responded with ${res.statusCode}`));
    });
    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout waiting for Flask server'));
    });
  });
}
function startMongoDB() {
  const mongoPath = path.join(process.resourcesPath, 'mongodb-binaries', 'mongod.exe');
  const dataDir = path.join(app.getPath('userData'), 'mongo-data');
  const logPath = path.join(dataDir, 'mongo.log');
  console.log(`MongoDB path: ${mongoPath}`);
  console.log(`Data dir: ${dataDir}`);
  console.log(`Log path: ${logPath}`);
  if (!fsSync.existsSync(mongoPath)) {
    console.error(`MongoDB executable not found at ${mongoPath}`);
    return Promise.reject(new Error('MongoDB executable not found'));
  }
  return fs.access(dataDir).catch(() => fs.mkdir(dataDir, { recursive: true })).then(() => {
    return new Promise((resolve, reject) => {
      mongoProcess = execFile(
        mongoPath,
        ['--dbpath', dataDir, '--bind_ip', '127.0.0.1', '--port', '27017', '--nojournal', '--storageEngine', 'wiredTiger', '--logpath', logPath],
        { windowsHide: true, maxBuffer: 1024 * 1024 * 10 }
      );
      mongoProcess.on('spawn', () => {
        console.log('MongoDB spawned');
        resolve();
      });
      mongoProcess.on('error', (err) => {
        console.error(`MongoDB failed: ${err.message}`);
        reject(err);
      });
    });
  });
}
function startFlaskServer() {
  const flaskExePath = path.join(process.resourcesPath, 'flask_server', 'flask_server.exe');
  const userUploads = path.join(app.getPath('userData'), 'Uploads');
  const userConfig = path.join(app.getPath('userData'), 'config');
  const userBackups = path.join(app.getPath('userData'), 'backups');
  console.log(`Flask path: ${flaskExePath}`);
  console.log(`User uploads: ${userUploads}`);
  console.log(`User config: ${userConfig}`);
  console.log(`User backups: ${userBackups}`);
  if (!fsSync.existsSync(flaskExePath)) {
    console.error(`Flask executable not found at ${flaskExePath}`);
    return Promise.reject(new Error('Flask executable not found'));
  }
  return fs.mkdir(userUploads, { recursive: true }).then(() => fs.mkdir(userConfig, { recursive: true })).then(() => fs.mkdir(userBackups, { recursive: true })).then(() => {
    return new Promise((resolve, reject) => {
      flaskProcess = execFile(
        flaskExePath,
        [],
        { env: { ...process.env, UPLOAD_FOLDER: userUploads, CONFIG_DIR: userConfig, BACKUP_DIR: userBackups }, windowsHide: true }
      );
      flaskProcess.on('spawn', () => {
        console.log('Flask spawned');
        resolve();
      });
      flaskProcess.on('error', (err) => {
        console.error(`Flask failed: ${err.message}`);
        reject(err);
      });
    });
  });
}
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
    autoHideMenuBar: true,
    show: false
  });
  const loadingHtml = `<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#f0f0f0;"><div>Loading...</div></body></html>`;
  mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(loadingHtml)}`).then(() => mainWindow.show()).catch((err) => {
    console.error(`Loading screen error: ${err.message}`);
    mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent('<h1>Error</h1><p>Check logs</p>')}`);
    mainWindow.show();
  });
  const maxRetries = 20;
  let retryCount = 0;
  const loadApp = () => {
    if (retryCount >= maxRetries) {
      console.error('Max retries reached');
      mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent('<h1>Error</h1><p>Backend not responding</p>')}`);
      return;
    }
    isFlaskServerRunning().then(() => {
      mainWindow.loadURL('http://127.0.0.1:5000').catch((err) => {
        console.error(`Load error: ${err.message}`);
        mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent('<h1>Error</h1><p>App failed to load</p>')}`);
      });
    }).catch(() => {
      retryCount++;
      console.log(`Retry ${retryCount}/${maxRetries}`);
      setTimeout(loadApp, 3000);
    });
  };
  setTimeout(loadApp, 2000);
}
function cleanupProcesses() {
  return new Promise((resolve) => {
    const killProcess = (proc, name) => {
      if (proc) {
        proc.on('exit', () => {
          console.log(`${name} terminated`);
          proc = null;
        });
        proc.kill('SIGTERM');
        setTimeout(() => {
          if (proc) {
            proc.kill('SIGKILL');
            console.log(`${name} force killed`);
            proc = null;
          }
        }, 5000);
      }
    };
    killProcess(flaskProcess, 'Flask');
    killProcess(mongoProcess, 'MongoDB');
    const checkDone = setInterval(() => {
      if (!flaskProcess && !mongoProcess) {
        clearInterval(checkDone);
        resolve();
      }
    }, 1000);
    setTimeout(() => {
      clearInterval(checkDone);
      resolve();
    }, 6000); // Fallback timeout
  });
}
let isQuitting = false;
app.on('before-quit', async (event) => {
  if (isQuitting) return;
  isQuitting = true;
  event.preventDefault();
  await cleanupProcesses();
  if (mainWindow) mainWindow.close();
  setTimeout(() => app.quit(), 1000);
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
app.on('will-quit', async (event) => {
  await cleanupProcesses();
});
app.whenReady().then(() => {
  console.log('Starting application');
  startMongoDB().then(() => {
    console.log('MongoDB started');
    return startFlaskServer();
  }).then(() => {
    console.log('Flask server started');
    createWindow();
  }).catch((err) => {
    console.error(`Startup failed: ${err.message}`);
    mainWindow?.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(`<h1>Error</h1><p>Startup failed: ${err.message}</p>`)}`);
    setTimeout(() => app.quit(), 5000);
  });
});