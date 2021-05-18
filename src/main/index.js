import { app, screen } from 'electron';
import AutoLaunch from 'auto-launch';
import bootstrap from './bootstrap';
import { destroyTray } from './tray';
import { checkUpdate } from './updater';
import './menu';
import './ipc';
import {
  createWindow as createClipboard,
  getWindow as getClipboard,
  destroyWindow as destroyClipboard,
  reCreateWindow,
  showWindow as showClipboard,
} from './window-clipboard';
import {
  createWindow as createSettings,
  getWindow as getSettings,
  destroyWindow as destroySettings,
} from './window-settings';
import { clearShortcuts } from './shortcut';
import { isProd, isWin, isMac } from '../shared/env';
import { isQuiting, appConfig$ } from './data';
import { showNotification } from './notification';
import logger from './logger';

const isPrimaryInstance = app.requestSingleInstanceLock();

// 解决透明闪烁
app.commandLine.appendSwitch('wm-window-animations-disabled');

if (!isPrimaryInstance) {
  // cannot find module '../dialog'
  // https://github.com/electron/electron/issues/8862#issuecomment-294303518
  app.exit();
} else {
  app.on('second-instance', (event, argv) => {
    showClipboard();
    // 如果是通过链接打开的应用，则添加记录
    if (argv[1]) {
      showNotification(argv[1], '浏览器打开');
    }
  });

  bootstrap.then(() => {
    createClipboard();
    createSettings();

    if (isWin || isMac) {
      app.setAsDefaultProtocolClient('paste');
    }

    if (isProd) {
      checkUpdate();
    }

    // 开机自启动配置
    const AutoLauncher = new AutoLaunch({
      name: 'Electron Paste',
      isHidden: true,
      mac: {
        useLaunchAgent: true,
      },
    });

    appConfig$.subscribe((data) => {
      const [appConfig, changed] = data;
      if (!changed.length || changed.indexOf('autoLaunch') > -1) {
        // 初始化或者选项变更时
        AutoLauncher.isEnabled()
          .then((enabled) => {
            // 状态不相同时
            if (appConfig.autoLaunch !== enabled) {
              return AutoLauncher[
                appConfig.autoLaunch ? 'enable' : 'disable'
              ]().catch(() => {
                logger.error(
                  `${appConfig.autoLaunch ? '执行' : '取消'}开机自启动失败`
                );
              });
            }
          })
          .catch(() => {
            logger.error('获取开机自启状态失败');
          });
      }
    });

    // app启动后导入electron-clipboard-extends, 否则linux下粘贴会卡死。
    require('./clipboard');

    app.on('window-all-closed', () => {
      logger.debug('window-all-closed');
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // 由main进程发起的退出
    app.on('before-quit', () => {
      isQuiting(true);
      destroyTray();
      destroyClipboard();
      destroySettings();
      clearShortcuts();
      require('electron-clipboard-extended').stopWatching();
      if (app.hasSingleInstanceLock()) app.releaseSingleInstanceLock();
    });

    app.on('activate', () => {
      if (getClipboard() === null) {
        createClipboard();
      }
      if (getSettings() === null) {
        createSettings();
      }
    });

    // 监听屏幕变化
    screen.on('display-metrics-changed', async () => {
      logger.debug('[screen]: display-changed');
      reCreateWindow();
    });

    screen.on('display-removed', () => {
      reCreateWindow();
      logger.debug('[screen]: display-removed');
    });

    screen.on('display-added', () => {
      reCreateWindow();
      logger.debug('[screen]: display-added');
    });

    if (!isProd) {
      if (isWin) {
        process.on('message', (data) => {
          if (data === 'graceful-exit') {
            app.quit();
          }
        });
      } else {
        process.on('SIGTERM', () => {
          app.quit();
        });
      }
    }
  });
}
