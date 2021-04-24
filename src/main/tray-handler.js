import { app, shell } from 'electron'
import bootstrapPromise, { appConfigPath } from './bootstrap'
import logger, { logPath } from './logger'
import {
  showWindow as showClipboard,
  openDevtool as cod,
  toggleWindow as toggleClipboard
} from './window-clipboard'
import { showWindow as showSettings, openDevtool as sod } from './window-settings'

// 打开窗口
export function showClipboardWindow () {
  showClipboard()
}

// 切换显隐
export function toggleClipboardWindow () {
  toggleClipboard()
}

// 打开选项设置页面
export function showSettingsWindow () {
  showSettings()
}

// 打开配置文件
export async function openConfigFile () {
  await bootstrapPromise
  shell.openPath(appConfigPath).then(e => {
    logger.error(`[tray]: 打开配置失败： ${e}`)
  })
}

// 打开日志文件
export async function openLog () {
  await bootstrapPromise
  shell.openPath(logPath).then(e => {
    logger.error(`[tray]: 打开日志文件： ${e}`)
  })
}

// 打开指定的url
export function openURL (url) {
  return shell.openExternal(url)
}

// 退出
export function exitApp () {
  app.quit()
}

export function openDevtool () {
  cod().then(() => {
    logger.debug('[tray]: open dev tool from clipboard.')
  })
  sod().then(() => {
    logger.debug('[tray]: open dev tool from settings.')
  })
}
