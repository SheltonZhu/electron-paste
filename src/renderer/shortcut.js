import Mousetrap from 'mousetrap';
import {
  toggleMenu,
  hideClipboard,
  nextFavorite,
  previousFavorite,
} from './ipc';

const func = {
  toggleMenu,
  hideClipboard,
  nextFavorite,
  previousFavorite,
};

export function init(appConfig) {
  Object.keys(appConfig.windowShortcuts).forEach((funcName) => {
    if (appConfig.windowShortcuts[funcName].enable) {
      bind(funcName, appConfig.windowShortcuts[funcName].key.toLowerCase());
    }
  });
}

export function unBind(oldKey) {
  Mousetrap.unbind(oldKey.toLowerCase());
}

export function bind(funcName, newKey) {
  Mousetrap.bind(newKey.toLowerCase(), func[funcName]);
}

export function changeBind(funcName, oldKey, newKey) {
  unBind(oldKey);
  bind(funcName, newKey);
}
