import Mousetrap from 'mousetrap';
import { toggleMenu, hideClipboard } from './ipc';

const func = {
  toggleMenu,
  hideClipboard,
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
  // console.log(`[shortcut]: Unregister shortcut: ${oldKey}`);
}

export function bind(funcName, newKey) {
  Mousetrap.bind(newKey.toLowerCase(), func[funcName]);
  // console.log(`[shortcut]: Register shortcut: ${newKey}`);
}

export function changeBind(funcName, oldKey, newKey) {
  unBind(oldKey);
  bind(funcName, newKey);
  // console.log(funcName, oldKey, newKey);
}
