import { ipcRenderer } from 'electron';
import store from './store';
import {
  // showNotification,
  showHtmlNotification,
} from './notification';
import * as events from '../shared/events';
import { changeBind } from './shortcut';

/**
 * ipc-render事件
 */
ipcRenderer
  .on(events.EVENT_APP_NOTIFY_MAIN, (e, { title, body }) => {
    // 显示main进程的通知
    showHtmlNotification(body, title);
  })
  .on(events.EVENT_APP_SHOW_PAGE, (e, targetView) => {
    // 显示具体某页面
    console.log('[renderer][ipc]: received view update: ', targetView.page);
    store.dispatch('changePage', { ...targetView, fromMain: true }).then();
  })
  .on(events.EVENT_APP_ERROR_MAIN, (e, err) => {
    // 弹框显示main进程报错内容
    alert(err);
  })
  .on(events.EVENT_RX_SYNC_MAIN, (e, appConfig) => {
    // 同步数据
    console.log('received sync data: %o', appConfig);
    store.dispatch('changeConfig', [appConfig]).then();
  })
  .on(events.EVENT_APP_CHANGE_BIND, (e, shortcut) => {
    changeBind(shortcut.funcName, shortcut.oldKey, shortcut.newKey);
  });

/**
 * 与main进程同步配置项
 * @param {Object} appConfig 用于更新的应用配置
 */
export function syncConfig(appConfig) {
  console.log('start sync data: %o', appConfig);
  ipcRenderer.send(events.EVENT_RX_SYNC_RENDERER, appConfig);
}

/**
 * 主动获取初始化数据
 */
export function getInitConfig() {
  console.log('[renderer][ipc]: get init config data');
  ipcRenderer.sendSync(events.EVENT_APP_WEB_INIT);
}

/**
 * 切换menu显示
 */
export function toggleMenu() {
  ipcRenderer.send(events.EVENT_APP_TOGGLE_MENU);
}

/**
 * 隐藏窗口
 */
export function hideClipboard() {
  ipcRenderer.send(events.EVENT_APP_HIDE_WINDOW_CLIPBOARD);
}

/**
 * 打开本地文件/目录
 */
export function openDialog(options) {
  return ipcRenderer.sendSync(events.EVENT_APP_OPEN_DIALOG, options);
}

/**
 * 隐藏并粘贴
 */
export function hideAndPaste(options) {
  return ipcRenderer.send(events.EVENT_APP_CLIPBOARD_PASTE, options);
}
