import { app, ipcMain, dialog, clipboard } from 'electron';
import { readJsonSync } from 'fs-extra';
import * as events from '../shared/events';
import { appConfigPath, defaultDownloadDir } from './bootstrap';
import { updateAppConfig } from './data';
import { hideWindow as hideClipboard } from './window-clipboard';
import defaultConfig, { mergeConfig } from '../shared/config';
import { showNotification } from './notification';
import logger from './logger';
import robot from 'robotjs';
import store from '../renderer/store';
import { toggleMenu } from './menu';
import pkg from '../../package.json';
/**
 * ipc-main事件
 */
ipcMain
  .on(events.EVENT_APP_HIDE_WINDOW_CLIPBOARD, () => {
    // 隐藏窗口
    hideClipboard();
  })
  .on(events.EVENT_APP_WEB_INIT, () => {
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
        robot.keyTap('v', 'control');
      }, 10);
    }
  });
