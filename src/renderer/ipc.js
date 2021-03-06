import { ipcRenderer } from 'electron';
import store from './store';
import { showHtmlNotification } from './notification';
import * as events from '../shared/events';
import { changeBind } from './shortcut';
import { defaultHistoryFavorite } from '../shared/env';
import { debounce } from '../shared/utils';

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
    store.dispatch('changePage', { ...targetView, fromMain: true }).then();
  })
  .on(events.EVENT_APP_ERROR_MAIN, (e, err) => {
    // 弹框显示main进程报错内容
    alert(err);
  })
  .on(events.EVENT_RX_SYNC_MAIN, (e, appConfig) => {
    // 同步数据
    store
      .dispatch('changeConfig', appConfig)
      .then()
      .catch((e) => {
        console.log(e);
      });
  })
  .on(events.EVENT_APP_CHANGE_BIND, (e, shortcut) => {
    changeBind(shortcut.funcName, shortcut.oldKey, shortcut.newKey);
  });

/**
 * 与main进程同步配置项
 * @param {Object} appConfig 用于更新的应用配置
 */
export function syncConfig(appConfig) {
  ipcRenderer.send(events.EVENT_RX_SYNC_RENDERER, appConfig);
}

/**
 * 主动获取初始化数据
 */
export function getInitConfig() {
  ipcRenderer.send(events.EVENT_APP_WEB_INIT);
}

/**
 * 切换menu显示
 */
export function toggleMenu() {
  ipcRenderer.send(events.EVENT_APP_TOGGLE_MENU);
}

/**
 * 隐藏主窗口
 */
export function hideClipboard() {
  ipcRenderer.send(events.EVENT_APP_HIDE_WINDOW_CLIPBOARD);
}

/**
 * 隐藏设置窗口
 */
export function hideSetting() {
  ipcRenderer.send(events.EVENT_APP_HIDE_WINDOW_SETTING);
}

/**
 * 隐藏并粘贴
 */
export function hideAndPaste(options) {
  return ipcRenderer.send(events.EVENT_APP_CLIPBOARD_PASTE, options);
}

/**
 * 打开设置
 * */
export function openSetting(options) {
  return ipcRenderer.send(events.EVENT_APP_OPEN_WINDOW_SETTING, options);
}

/**
 * 打开配置
 * */
export function openConfig(options) {
  return ipcRenderer.send(events.EVENT_APP_OPEN_CONFIG, options);
}

/**
 * 打开日志
 * */
export function openLog(options) {
  return ipcRenderer.send(events.EVENT_APP_OPEN_LOG, options);
}

/**
 * 查询剪贴板数据
 * */
export function listClipboardData() {
  return ipcRenderer.send(events.EVENT_APP_CLIPBOARD_DATA_LIST, {
    favorite: store.state.favorite,
    query: store.state.query,
    cardType: store.state.searchType,
  });
}

export const listClipboardDataDebounce = debounce(listClipboardData, 200);

/**
 * 清除历史记录
 * */
export function clearClipboardData() {
  return ipcRenderer.sendSync(events.EVENT_APP_CLIPBOARD_DATA_CLEAR);
}

/**
 * 清除一条记录
 * */
export function removeClipboardData(_id) {
  return ipcRenderer.sendSync(events.EVENT_APP_CLIPBOARD_DATA_REMOVE, _id);
}

/**
 * 修改内容
 * */
export function editClipboardData(data) {
  return ipcRenderer.send(events.EVENT_APP_CLIPBOARD_DATA_EDIT, data);
}

/**
 * 修改一条记录名字
 * */
export function renameClipboardData(_id, name) {
  return ipcRenderer.sendSync(events.EVENT_APP_CLIPBOARD_DATA_RENAME, {
    _id,
    name,
  });
}

/**
 * 检查历史记录容量
 * */
export function checkHistoryCapacity() {
  return ipcRenderer.send(events.EVENT_APP_CHECK_HISTORY_CAPACITY);
}

/**
 * 列出收藏标签
 * */
export function listFavoriteData() {
  return ipcRenderer.send(events.EVENT_APP_FAVORITE_DATA_LIST);
}

/**
 * 添加收藏标签
 * */
export function addFavorite(name, color) {
  return ipcRenderer.send(events.EVENT_APP_FAVORITE_DATA_ADD, { name, color });
}

/**
 * 移动到收藏
 * */
export function move2Favorite(data) {
  return ipcRenderer.send(events.EVENT_APP_FAVORITE_DATA_MOVE, data);
}

/**
 * 更新收藏标签
 * */
export function updateFavorite(_id, data) {
  return ipcRenderer.sendSync(events.EVENT_APP_FAVORITE_DATA_UPDATE, {
    _id,
    data,
  });
}

/**
 * 删除收藏标签
 * */
export function removeFavorite(data) {
  return ipcRenderer.sendSync(events.EVENT_APP_FAVORITE_DATA_REMOVE, data);
}

/**
 * 收藏标签排序
 * */
export function sortFavorite(list) {
  return ipcRenderer.send(events.EVENT_APP_FAVORITE_DATA_SORT, list);
}

/**
 * 得到图标map
 * */
export function getIconMapData() {
  return ipcRenderer.send(events.EVENT_APP_CLIPBOARD_ICON_LIST);
}

/**
 * 快捷键函数
 * */
export function previousFavorite() {
  const previousIndex = _findLabelIndex() - 1;
  if (previousIndex === -1) {
    store
      .dispatch('changeFavorite', defaultHistoryFavorite)
      .then(listClipboardDataDebounce);
  } else if (previousIndex < -1) {
    store
      .dispatch(
        'changeFavorite',
        store.state.favoritesData[store.state.favoritesData.length - 1]._id
      )
      .then(listClipboardDataDebounce);
  } else {
    store
      .dispatch('changeFavorite', store.state.favoritesData[previousIndex]._id)
      .then(listClipboardDataDebounce);
  }
}

/**
 * 快捷键函数
 * */
export function nextFavorite() {
  const nextIndex = _findLabelIndex() + 1;
  if (nextIndex > store.state.favoritesData.length - 1) {
    store
      .dispatch('changeFavorite', defaultHistoryFavorite)
      .then(listClipboardDataDebounce);
  } else {
    store
      .dispatch('changeFavorite', store.state.favoritesData[nextIndex]._id)
      .then(listClipboardDataDebounce);
  }
}

function _findLabelIndex() {
  return store.state.favoritesData.findIndex(
    (element) => element._id === store.state.favorite
  );
}
