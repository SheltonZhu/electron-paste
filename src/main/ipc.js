import { app, ipcMain, dialog, clipboard } from 'electron';
import { readJsonSync } from 'fs-extra';
import * as events from '../shared/events';
import { appConfigPath, defaultDownloadDir } from './bootstrap';
import { updateAppConfig } from './data';
import {
  hideWindow as hideClipboard,
  sendData as sendToClipboard,
} from './window-clipboard';
import {
  sendData as sendToSetting,
  showWindow as showSetting,
} from './window-settings';
import defaultConfig, { mergeConfig } from '../shared/config';
import { showNotification } from './notification';
import { toggleMenu } from './menu';
import { CARD_TYPE, defaultHistoryFavorite } from '../shared/env';
import { clone } from '../shared/utils';

import logger from './logger';
// import robot from 'robotjs';
import store from '../renderer/store';
import pkg from '../../package.json';
import db from './db';

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
  .on(events.EVENT_APP_OPEN_WINDOW_SETTING, async (e) => {
    showSetting();
  })
  .on(events.EVENT_APP_TOGGLE_MENU, () => {
    toggleMenu();
  })
  .on(events.EVENT_APP_CLIPBOARD_DATA_LIST, async (e, params) => {
    const retData = await db.clipboardCard.list(
      params.favorite,
      params.query,
      params.cardType
    );
    store.commit('updateClipboardData', retData);
  })
  .on(events.EVENT_APP_CLIPBOARD_DATA_CLEAR, async (e) => {
    const affectedNum = await db.clipboardCard.clear(defaultHistoryFavorite);
    if (store.state.favorite === defaultHistoryFavorite) {
      store.commit('updateClipboardData', []);
    }
    e.returnValue = affectedNum;
  })
  .on(events.EVENT_APP_CHECK_HISTORY_CAPACITY, async (e) => {
    await db.clipboardCard.checkHistoryCapacity();
  })
  .on(events.EVENT_APP_CLIPBOARD_PASTE, async (e, params) => {
    hideClipboard();
    const text = 'text';
    const html = '<b>html</b>';
    const rtf =
      '{\\rtf1\\ansi{\\fonttbl\\f0\\fswiss Helvetica;}\\f0\\pard\nThis is some {\\b bold} text.\\par\n}';
    clipboard.write({
      text: text,
      html: html,
      rtf: rtf,
    });
    if (params.directPaste && store.state.appConfig.directPaste) {
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
  sendToSetting(events.EVENT_APP_ERROR_MAIN, err).then();
}

export function changeBindKey(funcName, oldKey, newKey) {
  sendToClipboard(events.EVENT_APP_CHANGE_BIND, {
    funcName,
    oldKey,
    newKey,
  }).then();
}

export function addOneClipboardData(data) {
  if (store.state.favorite === defaultHistoryFavorite) {
    if (store.state.query) {
      if (data.cardType === CARD_TYPE.IMAGE) {
        if (store.state.searchType === CARD_TYPE.IMAGE)
          updateClipboardData(data);
      } else {
        if (
          (!store.state.searchType ||
            store.state.searchType === data.cardType) &&
          new RegExp(store.state.query, 'i').test(data.copyContent)
        ) {
          updateClipboardData(data);
        }
      }
    } else {
      if (!store.state.searchType || store.state.searchType === data.cardType) {
        updateClipboardData(data);
      }
    }
  }
}

function updateClipboardData(data) {
  const list = clone(store.state.clipboardData, true);
  list.unshift(data);

  if (list.length > store.state.appConfig.historyCapacityNum) {
    list.pop();
  }
  store.commit('updateClipboardData', list);
}
