import path from 'path';
import { app } from 'electron';
import { ensureDir, pathExists, outputJson } from 'fs-extra';
import logger from './logger';
import defaultConfig from '../shared/config';
import { init as initIcon } from '../shared/icon';

// app ready事件
export const readyPromise = new Promise((resolve) => {
  if (app.isReady()) {
    resolve();
  } else {
    app.once('ready', resolve);
  }
});

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\');
}

// 未捕获的rejections
process.on('unhandledRejection', (reason, p) => {
  logger.error(`Unhandled Rejection at: Promise ${p}, reason: ${reason}`);
});

// // 未捕获的exception
process.on('uncaughtException', (error) => {
  logger.error(error.stack || JSON.stringify(error));
});

// 应用配置存储目录
export const appConfigDir = app.getPath('userData');
// 应用配置存储路径
export const appConfigPath = path.join(appConfigDir, 'config.json');
// 默认的下载目录
export const defaultDownloadDir = path.join(appConfigDir, 'electron-paste');

// 当前可执行程序的路径
export const exePath = app.getPath('exe');

/**
 * 确保文件存在，目录正常
 */
async function init() {
  initIcon();
  await ensureDir(appConfigDir);
  // 判断配置文件是否存在，不存在用默认数据写入
  const configFileExists = await pathExists(appConfigPath);
  if (!configFileExists) {
    await outputJson(appConfigPath, defaultConfig, { spaces: '\t' });
  }
  await ensureDir(path.join(appConfigDir, 'logs'));

  return readyPromise;
}

export default init();
