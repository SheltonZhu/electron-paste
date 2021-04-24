import { app, screen } from 'electron'
// import AutoLaunch from 'auto-launch'
import clipboard from 'electron-clipboard-extended'
import bootstrap from './bootstrap'
import { isQuiting } from './data'
import renderTray, { destroyTray } from './tray'
import { checkUpdate } from './updater'
import './menu'
import './ipc'
import './clipboard'
import {
  createWindow as createClipboard,
  getWindow as getClipboard,
  destroyWindow as destroyClipboard,
  reCreateWindow
} from './window-clipboard'
import {
  createWindow as createSettings,
  getWindow as getSettings,
  destroyWindow as destroySettings
} from './window-settings'

import logger from './logger'
import { clearShortcuts } from './shortcut'
import { isProd, isWin } from '../shared/env'

const isPrimaryInstance = app.requestSingleInstanceLock()

if (!isPrimaryInstance) {
  // cannot find module '../dialog'
  // https://github.com/electron/electron/issues/8862#issuecomment-294303518
  app.exit()
} else {
  app.on('second-instance', (event, argv) => {
    // showWindow()
    // // 如果是通过链接打开的应用，则添加记录
    // if (argv[1]) {
    //   const configs = loadConfigsFromString(argv[1])
    //   if (configs.length) {
    //     addConfigs(configs)
    //   }
    // }
  })

  bootstrap.then(() => {
    logger.info('[app]: Bootstrap...')
    // createClipboard()
    createSettings()
    renderTray()
    if (isProd) {
      checkUpdate()
    }

    // 开机自启动配置
    // const AutoLauncher = new AutoLaunch({
    //   name: 'Electron Paste',
    //   isHidden: true,
    //   mac: {
    //     useLaunchAgent: true
    //   }
    // })

    // appConfig$.subscribe(data => {
    //   const [appConfig, changed] = data
    //   if (!changed.length || changed.indexOf('autoLaunch') > -1) {
    //     // 初始化或者选项变更时
    //     AutoLauncher.isEnabled().then(enabled => {
    //       // 状态不相同时
    //       if (appConfig.autoLaunch !== enabled) {
    //         return AutoLauncher[appConfig.autoLaunch ? 'enable' : 'disable']().catch(() => {
    //           logger.error(`${appConfig.autoLaunch ? '执行' : '取消'}开机自启动失败`)
    //         })
    //       }
    //     }).catch(() => {
    //       logger.error('获取开机自启状态失败')
    //     })
    //   }
    // })

    app.on('window-all-closed', () => {
      logger.debug('window-all-closed')
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    // 由main进程发起的退出
    app.on('before-quit', () => {
      isQuiting(true)
      destroyTray()
      destroyClipboard()
      destroySettings()
      clearShortcuts()
      clipboard.stopWatching()
      if (app.hasSingleInstanceLock()) app.releaseSingleInstanceLock()
    })

    app.on('activate', () => {
      if (getClipboard() === null) {
        createClipboard()
      }
      if (getSettings() === null) {
        createSettings()
      }
    })

    //监听屏幕变化
    screen.on('display-metrics-changed', async () => {
      logger.debug('[screen]: display-changed')
      reCreateWindow()
    })

    screen.on('display-removed', () => {
      reCreateWindow()
      logger.debug('[screen]: display-removed')
    })

    screen.on('display-added', () => {
      reCreateWindow()
      logger.debug('[screen]: display-added')
    })

    // if (!isProd) {
    //   if (isWin) {
    //     process.on('message', data => {
    //       if (data === 'graceful-exit') {
    //         app.quit()
    //       }
    //     })
    //   } else {
    //     process.on('SIGTERM', () => {
    //       app.quit()
    //     })
    //   }
    // }
    logger.info('[app]: Bootstrap...done.')
  })
}
