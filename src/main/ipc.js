import { ipcMain, clipboard, nativeImage } from 'electron';
import { readJsonSync } from 'fs-extra';
import * as events from '../shared/events';
import { appConfigPath } from './bootstrap';
import { updateAppConfig } from './data';
import {
  hideWindow as hideClipboard,
  sendData as sendToClipboard,
} from './window-clipboard';
import {
  hideWindow as hideSetting,
  sendData as sendToSetting,
  showWindow as showSetting,
} from './window-settings';
import defaultConfig, { mergeConfig } from '../shared/config';
import { showNotification } from './notification';
import { toggleMenu } from './menu';
import { CARD_TYPE, defaultHistoryFavorite, meta } from '../shared/env';
import { clone } from '../shared/utils';
import { openConfigFile, openLog } from './tray-handler';
import logger from './logger';
import robot from 'robotjs';
import store from '../renderer/store';
import db from './db';

/**
 * ipc-main事件
 */
ipcMain
  .on(events.EVENT_APP_HIDE_WINDOW_CLIPBOARD, () => {
    // 隐藏窗口
    hideClipboard();
  })
  .on(events.EVENT_APP_HIDE_WINDOW_SETTING, () => {
    // 隐藏窗口
    hideSetting();
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
      meta: meta,
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
  .on(events.EVENT_APP_OPEN_WINDOW_SETTING, async (e) => {
    showSetting();
  })
  .on(events.EVENT_APP_OPEN_CONFIG, async (e) => {
    await openConfigFile();
  })
  .on(events.EVENT_APP_OPEN_LOG, async (e) => {
    await openLog();
  })

  .on(events.EVENT_APP_TOGGLE_MENU, () => {
    toggleMenu();
  })
  .on(events.EVENT_APP_CHECK_HISTORY_CAPACITY, async (e) => {
    await db.clipboardCard.checkHistoryCapacity();
    if (store.state.favorite === defaultHistoryFavorite) {
      const retData = await db.clipboardCard.list(
        defaultHistoryFavorite,
        store.state.query,
        store.state.searchType
      );
      store.commit('updateClipboardData', retData);
    }
  })
  .on(events.EVENT_APP_FAVORITE_DATA_LIST, async (e, params) => {
    const retData = await db.favorites.listBySort();
    await store.dispatch('changeFavoriteData', retData);
  })
  .on(events.EVENT_APP_FAVORITE_DATA_ADD, async (e, params) => {
    const favoritesData = clone(store.state.favoritesData, true);
    params.sort = favoritesData.length + 1;
    const favorite = await db.favorites.create(params);
    favoritesData.push(favorite);
    await store.dispatch('changeFavoriteData', favoritesData);
  })
  .on(events.EVENT_APP_FAVORITE_DATA_MOVE, async (e, data) => {
    await addOneClipboardData(data);
  })
  .on(events.EVENT_APP_FAVORITE_DATA_UPDATE, async (e, params) => {
    e.returnValue = await updateFavoriteData(params._id, params.data);
  })
  .on(events.EVENT_APP_FAVORITE_DATA_REMOVE, async (e, data) => {
    const affectedNum = await db.clipboardCard.clear(data._id);
    await removeFavorite(data);
    e.returnValue = affectedNum;
  })
  .on(events.EVENT_APP_FAVORITE_DATA_SORT, async (e, list) => {
    await db.favorites.updateSort(list);
  })
  .on(events.EVENT_APP_CLIPBOARD_ICON_LIST, async (e) => {
    await getIconMap();
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
  .on(events.EVENT_APP_CLIPBOARD_DATA_REMOVE, async (e, _id) => {
    e.returnValue = await removeOneClipboardData(_id);
  })
  .on(events.EVENT_APP_CLIPBOARD_DATA_RENAME, async (e, params) => {
    e.returnValue = await db.clipboardCard.updateById(params._id, {
      name: params.name,
    });
  })
  .on(events.EVENT_APP_CLIPBOARD_DATA_EDIT, async (e, params) => {
    logger.info(params);
    await db.clipboardCard.updateById(params._id, params);
  })
  .on(events.EVENT_APP_CLIPBOARD_PASTE, async (e, params) => {
    hideClipboard();
    switch (params.data.cardType) {
      case CARD_TYPE.IMAGE:
        const image = nativeImage.createFromDataURL(params.data.base64data);
        clipboard.writeImage(image);
        if (params.directPaste && store.state.appConfig.directPaste) {
          setTimeout(async () => {
            robot.keyTap('v', 'control');
          }, 10);
        }
        break;
      case CARD_TYPE.TEXT:
      case CARD_TYPE.LINK:
        clipboard.write({
          text: params.data.text,
          html: params.data.html,
          rtf: params.data.rtf,
        });
        if (params.directPaste && store.state.appConfig.directPaste) {
          if (store.state.appConfig.textMode || params.textMode) {
            setTimeout(async () => {
              robot.keyTap('v', ['control', 'shift']);
            }, 10);
          } else {
            setTimeout(async () => {
              robot.keyTap('v', 'control');
            }, params.timeout || 10);
          }
        }
        break;
      case CARD_TYPE.FILE:
        // TODO file
        break;
      default:
        throw new Error(`unknown type ${params.data.cardType}`);
    }
  });

export async function getIconMap() {
  const iconMap = await db.clipboardCardIcon.getIconMap();
  await store.dispatch('changeIconMap', iconMap);
}

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
  logger.debug('[main][ipc]: ', data);
  return db.clipboardCard.add(data);
}

export function updateFavoriteData(_id, data) {
  return db.favorites.updateById(_id, data);
}

export function removeFavorite(data) {
  return db.favorites.removeAndUpdateSort(data);
}

export function removeOneClipboardData(_id) {
  return db.clipboardCard.removeOne(_id);
}

export function updateClipboardData(data) {
  if (store.state.favorite === defaultHistoryFavorite) {
    if (store.state.query) {
      if (data.cardType === CARD_TYPE.IMAGE) {
        if (store.state.searchType === CARD_TYPE.IMAGE) {
          _updateClipboardData(data);
        }
      } else {
        if (
          (!store.state.searchType ||
            store.state.searchType === data.cardType) &&
          new RegExp(store.state.query, 'i').test(data.copyContent)
        ) {
          _updateClipboardData(data);
        }
      }
    } else {
      if (!store.state.searchType || store.state.searchType === data.cardType) {
        _updateClipboardData(data);
      }
    }
  }
}

function _updateClipboardData(data) {
  const list = clone(store.state.clipboardData, true);
  list.unshift(data);

  if (list.length > store.state.appConfig.historyCapacityNum) {
    list.pop();
  }
  store.commit('updateClipboardData', list);
}
