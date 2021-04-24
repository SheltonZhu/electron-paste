import { Menu, nativeImage, Tray } from 'electron'
import * as handler from './tray-handler'
import { checkUpdate } from './updater'
import { isMac } from '../shared/env'
import { appTray } from '../shared/icon'
import logger from './logger'

let tray

/**
 * 生成菜单
 */
function generateMenus () {
  return [
    { label: '设置', click: handler.showSettingsWindow },
    {
      label: '配置', submenu: [
        { label: '打开配置文件', click: handler.openConfigFile }
      ]
    },
    {
      label: '帮助', submenu: [
        { label: '检查更新', click: () => checkUpdate(true) },
        { label: '查看日志', click: handler.openLog },
        {
          label: '项目主页', click: () => {
            handler.openURL('https://github.com/SheltonZhu/electron-paste').then()
          }
        },
        {
          label: 'Bug反馈', click: () => {
            handler.openURL('https://github.com/SheltonZhu/electron-paste/issues').then()
          }
        },
        { label: '打开开发者工具', click: handler.openDevtool }
      ]
    },
    { label: '退出', click: handler.exitApp }
  ]
}

/**
 * 更新任务栏菜单
 */
function updateTray () {
  const menus = generateMenus()
  const contextMenu = Menu.buildFromTemplate(menus)
  tray.setContextMenu(contextMenu)
  tray.setToolTip(getTooltip())
}

// 根据配置显示tray tooltip
function getTooltip () {
  return 'Electron Paste'
}
/**
 * 设置托盘图标
 * @param {string} trayIcon
 */
function setTrayIcon (trayIcon) {
  tray.setImage(trayIcon)
  isMac && tray.setPressedImage(trayIcon)
}

/**
 * 渲染托盘图标和托盘菜单
 */
export default function renderTray () {
  // 生成tray
  logger.debug('[tray]: render tray...')
  tray = new Tray(nativeImage.createEmpty())
  updateTray()
  setTrayIcon(appTray)
  // tray.on((isMac || isWin) ? 'double-click' : 'click', handler.toggleClipboardWindow)
  tray.on( 'click', handler.toggleClipboardWindow)
  logger.debug('[tray]: render tray done.')
}

/**
 * 销毁托盘
 */
export function destroyTray () {
  if (tray) {
    tray.destroy()
  }
}
