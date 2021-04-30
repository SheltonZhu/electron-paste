import { app, BrowserWindow, screen } from 'electron';
import { appConfig$, isQuiting } from './data';
import logger from './logger';
import { appIcon } from '../shared/icon';
import { isProd, isLinux } from '../shared/env';

const winURL = !isProd
  ? `http://localhost:9080/clipboard`
  : `file://${__dirname}/clipboard/index.html`;

let mainWindow;
let readyPromise;

/**
 * 创建主视图
 */
export function createWindow() {
  if (process.platform === 'darwin') {
    app.dock.hide();
  }
  const display = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: display.width,
    height: 472,
    x: 0,
    y: isLinux ? display.height : display.height - 472,
    backgroundColor: '#00000000',
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    fullscreenable: false,
    minimizable: false,
    closable: false,
    autoHideMenuBar: true,
    hasShadow: true,
    skipTaskbar: true,
    vibrancy: 'light', // macos
    icon: appIcon,
    title: 'ClipBoard',
    titleBarStyle: 'hidden',
    // show: !isProd,
    show: false,
    webPreferences: {
      webSecurity: isProd,
      nodeIntegration: true,
      experimentalFeatures: true,
      enableRemoteModule: true,
    },
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL(winURL).then(() => {});
  // hide to tray when window closed
  mainWindow.on('close', (e) => {
    // 当前不是退出APP的时候才去隐藏窗口
    if (!isQuiting()) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 窗口失去焦点隐藏
  appConfig$.subscribe((data) => {
    const [appConfig, changed] = data;
    if (!changed.length || changed.indexOf('enableHideWhenBlur') > -1) {
      if (appConfig.enableHideWhenBlur) {
        mainWindow.on('blur', hideWindow);
      } else {
        mainWindow.removeAllListeners('blur');
      }
    }
  });

  readyPromise = new Promise((resolve) => {
    mainWindow.webContents.once('did-finish-load', resolve);
  });
  if (!isProd) {
    openDevtool().then();
  }
}

/**
 * 返回主视图
 */
export function getWindow() {
  return mainWindow;
}

/**
 * 显示主视图
 */
export function showWindow() {
  if (mainWindow) {
    mainWindow.show();
  }
}

/**
 * 隐藏主视图
 */
export function hideWindow() {
  isQuiting(false);
  if (mainWindow) {
    mainWindow.hide();
  }
}

/**
 * 切换窗体显隐
 */
export function toggleWindow() {
  if (mainWindow) {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  }
}

/**
 * 销毁主视图
 */
export function destroyWindow() {
  if (mainWindow) {
    mainWindow.destroy();
    mainWindow = null;
  }
}

/**
 * 重启窗口
 */
export function reCreateWindow() {
  if (mainWindow) {
    destroyWindow();
  }
  createWindow();
}

/**
 * 向主窗口发送消息
 */
export async function sendData(channel, ...args) {
  if (mainWindow) {
    await readyPromise;
    mainWindow.webContents.send(channel, ...args);
  } else {
    logger.debug('not ready');
  }
}

/**
 * 打开开发者工具
 */
export async function openDevtool() {
  if (mainWindow) {
    await readyPromise;
    mainWindow.webContents.openDevTools();
  } else {
    logger.debug('not ready');
  }
}
