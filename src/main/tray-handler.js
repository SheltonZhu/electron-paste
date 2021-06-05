import { app, shell, dialog } from 'electron';
import bootstrapPromise, { appConfigPath } from './bootstrap';
import logger, { logPath } from './logger';
import { meta } from '../shared/env';
import { chooseSavePath, chooseFile } from '../shared/dialog';
import { writeJson, readJson } from 'fs-extra';
import { currentConfig, updateAppConfig } from './data';

import {
  showWindow as showClipboard,
  openDevtool as cod,
  toggleWindow as toggleClipboard,
} from './window-clipboard';
import {
  showWindow as showSettings,
  openDevtool as sod,
} from './window-settings';
import { notificationIcon } from '../shared/icon';
import { showNotification } from './notification';

// 导出配置文件
export function exportConfigToFile() {
  chooseSavePath('选择导出的目录', {}, 'config.json').then((filePath) => {
    logger.debug('[exportConfigToFile]: filePath:', filePath);
    if (filePath) {
      writeJson(filePath, currentConfig, { spaces: '\t' });
      showNotification(`点击打开: ${filePath}`, '导出配置成功!', () => {
        shell.openPath(filePath).catch((e) => {
          logger.error(`[tray]: 打开配置失败： ${e}`);
        });
      });
    }
  });
}

// 导入配置文件
export function importConfigFromFile() {
  chooseFile(
    '选择config.json',
    [{ name: 'Json', extensions: ['json'] }],
    'config.json'
  ).then((filePath) => {
    logger.debug('[importConfigFromFile]: filePath:', filePath);
    if (filePath) {
      readJson(filePath)
        .then((fileConfig) => {
          logger.debug('fileConfig:', fileConfig);
          updateAppConfig(fileConfig, false);
          showNotification(`导入配置: ${filePath}`, '导入配置成功!');
        })
        .catch((e) => {
          logger.error(e);
          showNotification(e.toString(), '导入配置失败!', () => {
            shell.openPath(filePath).catch((e) => {
              logger.error(`[tray]: 打开配置失败： ${e}`);
            });
          });
        });
    }
  });
}

// 打开窗口
export function showClipboardWindow() {
  showClipboard();
}

// 切换显隐
export function toggleClipboardWindow() {
  toggleClipboard();
}

// 打开选项设置页面
export function showSettingsWindow() {
  showSettings();
}

// 打开配置文件
export async function openConfigFile() {
  await bootstrapPromise;
  shell.openPath(appConfigPath).catch((e) => {
    logger.error(`[tray]: 打开配置失败： ${e}`);
  });
}

// 打开日志文件
export async function openLog() {
  await bootstrapPromise;
  shell.openPath(logPath).catch((e) => {
    logger.error(`[tray]: 打开日志文件失败： ${e}`);
  });
}

// 打开指定的url
export function openURL(url) {
  return shell.openExternal(url);
}

// 退出
export function exitApp() {
  app.quit();
}

// 打开开发者工具
export function openDevtool() {
  cod().then(() => {
    logger.debug('[tray]: open dev tool from clipboard.');
  });
  sod().then(() => {
    logger.debug('[tray]: open dev tool from settings.');
  });
}

// 打开版本信息
export function showVersionInfo() {
  dialog
    .showMessageBox({
      icon: notificationIcon,
      title: 'Electron Paste',
      message: 'Electron Paste',
      detail: [
        '版本: ' + meta.version,
        'Electron: ' + meta.electron,
        'Chrome: ' + meta.chrome,
        'Node.js: ' + meta.nodejs,
        'V8: ' + meta.v8,
        'OS: ' + meta.os,
      ].join('\n'),
    })
    .then();
}
