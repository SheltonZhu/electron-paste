import { join } from 'path';
import { nativeImage } from 'electron';
import { isMac } from './env';

function getImage(name, template = true, highlight = false) {
  return nativeImage.createFromPath(
    join(
      __static,
      `${name}${
        isMac && template ? (highlight ? 'Highlight' : 'Template') : ''
      }.png`
    )
  );
}

export let notificationIcon;
export let appTrayIcon;
export let appIcon;

export function init() {
  notificationIcon = getImage('icon', false, false);
  appTrayIcon = getImage('icon', false);
  appIcon = getImage('icon', false);
}
