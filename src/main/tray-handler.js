import { app, shell } from 'electron'
import bootstrapPromise, { appConfigPath } from './bootstrap'
import logger, { logPath } from './logger'
import { showWindow as showClipboard, openDevtool, toggleWindow as toggleClipboard } from './window_clipboard'
import { showWindow as showSettings } from './window_settings'

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
  shell.openItem(appConfigPath)
}

// 打开日志文件
export async function openLog () {
  await bootstrapPromise
  shell.openItem(logPath)
}

// 打开指定的url
export function openURL (url) {
  return shell.openExternal(url)
}

// 退出
export function exitApp () {
  app.quit()
}
