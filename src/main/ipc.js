import { app, ipcMain, dialog, clipboard } from 'electron';
import { readJsonSync } from 'fs-extra';
import * as events from '../shared/events';
import { appConfigPath, defaultDownloadDir } from './bootstrap';
import { updateAppConfig } from './data';
import {
  hideWindow as hideClipboard,
  sendData as sendToClipboard,
} from './window-clipboard';
import { sendData as sendToSettings } from './window-settings';
import defaultConfig, { mergeConfig } from '../shared/config';
import { showNotification } from './notification';
import { toggleMenu } from './menu';
import logger from './logger';
// import robot from 'robotjs';
import store from '../renderer/store';
import pkg from '../../package.json';

/**
 * ipc-main事件
 */
ipcMain
  .on(events.EVENT_APP_HIDE_WINDOW_CLIPBOARD, () => {
    // 隐藏窗口
    hideClipboard();
  })
  .on(events.EVENT_APP_WEB_INIT, (e) => {
    // 页面初始化
    let stored;
    try {
      stored = readJsonSync(appConfigPath);
      mergeConfig(stored);
    } catch (e) {
      stored = defaultConfig;
    }
    const res = {
      config: stored,
      meta: {
        version: pkg.version,
        electron: app.getVersion(),
        defaultDownloadDir,
      },
    };
    // e.returnValue = res;
    store.dispatch('initConfig', res).then();
  })
  .on(events.EVENT_RX_SYNC_RENDERER, (_, data) => {
    // 同步数据
    logger.debug(`received sync data: ${data}`);
    updateAppConfig(data, true);
  })
  .on(events.EVENT_APP_NOTIFY_RENDERER, (_, body, title) => {
    // 显示来自renderer进程的通知
    showNotification(body, title);
  })
  .on(events.EVENT_APP_OPEN_DIALOG, async (e, params) => {
    const ret = await dialog.showOpenDialog(params);
    e.returnValue = ret.filePaths;
  })
  .on(events.EVENT_APP_TOGGLE_MENU, () => {
    toggleMenu();
  })
  .on(events.EVENT_APP_CLIPBOARD_PASTE, async (e, params) => {
    hideClipboard();
    clipboard.writeText(params.content);
    if (params.directPaste) {
      setTimeout(async () => {
        // robot.keyTap('v', 'control');
      }, 10);
    }
  });

/**
 * 将main进程的错误在renderer进程显示出来
 * @param {String|Object} err 错误内容
 */
export function showMainError(err) {
  sendToClipboard(events.EVENT_APP_ERROR_MAIN, err).then();
  sendToSettings(events.EVENT_APP_ERROR_MAIN, err).then();
}

export function changeBindKey(funcName, oldKey, newKey) {
  sendToClipboard(events.EVENT_APP_CHANGE_BIND, {
    funcName,
    oldKey,
    newKey,
  }).then();
}
