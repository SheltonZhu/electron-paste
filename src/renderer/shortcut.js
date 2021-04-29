import Mousetrap from "mousetrap";
import { toggleMenu, hideClipboard } from "./ipc";

const func = {
  toggleMenu,
  hideClipboard,
};

export function init(appConfig) {
  Object.keys(appConfig.windowShortcuts).forEach((funcName) => {
    if (appConfig.windowShortcuts[funcName].enable) {
      console.log(
        `[shortcut]: Register shortcut: ${appConfig.windowShortcuts[funcName].key}`
      );
      Mousetrap.bind(
        appConfig.windowShortcuts[funcName].key.toLowerCase(),
        func[funcName]
      );
    }
  });
}

export function changeBind(funcName, oldKey, newKey) {
  Mousetrap.unbind(oldKey);
  Mousetrap.bind(newKey, func[funcName]);
}
