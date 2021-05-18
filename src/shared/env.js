import os from 'os';
import { execSync } from 'child_process';

export const platform = os.platform();
export const isWin = platform === 'win32';
export const isMac = platform === 'darwin';
export const isLinux = platform === 'linux';
export const isProd = process.env.NODE_ENV !== 'development';
export const osInfo = [platform, os.arch(), os.release()].join(' ');
export const defaultHistoryFavorite = 'historyFavorite';
export const PAGE_PERSONALIZATION = { name: 'personalization', page: '1' };
export const PAGE_GENERAL = { name: 'general', page: '2' };
export const PAGE_SHORTCUT = { name: 'shortcut', page: '3' };
export const PAGE_RULES = { name: 'rules', page: '4' };
export const PAGE_ABOUT = { name: 'about', page: '5' };
export const CARD_TYPE = {
  TEXT: 'Text',
  LINK: 'Link',
  IMAGE: 'Image',
  FILE: 'File',
};

// mac版本号
export let macVersion;
// mac版本是否低于10.11
export let isOldMacVersion = false;
if (isMac) {
  try {
    const result = execSync('sw_vers').toString();
    macVersion = result.match(/ProductVersion:[ \t]*([\d.]*)/)[1];
    const matchedVersion = [10, 11, 0];
    const splited = macVersion.split('.');
    for (let i = 0; i < splited.length; i++) {
      if (splited[i] > matchedVersion[i]) {
        isOldMacVersion = false;
        break;
      } else if (splited[i] < matchedVersion[i]) {
        isOldMacVersion = true;
        break;
      } else if (i === 2 && splited[i] === matchedVersion[i]) {
        isOldMacVersion = true;
      }
    }
  } catch (error) {
    // do nothing
  }
}
