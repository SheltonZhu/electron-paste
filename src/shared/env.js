import os from 'os'
import { execSync } from 'child_process'

export const platform = os.platform()
export const isWin = platform === 'win32'
export const isMac = platform === 'darwin'
export const isLinux = platform === 'linux'
export const isProd = process.env.NODE_ENV !== 'development'
export const PAGE_PERSONALIZATION = '1'
export const PAGE_GENERAL = '2'
export const PAGE_SHORTCUT = '3'
export const PAGE_RULES = '4'
export const PAGE_ABOUT = '5'
// mac版本号
export let macVersion
// mac版本是否低于10.11
export let isOldMacVersion = false
if (isMac) {
  try {
    const result = execSync('sw_vers').toString()
    macVersion = result.match(/ProductVersion:[ \t]*([\d.]*)/)[1]
    const matchedVersion = [10, 11, 0]
    const splited = macVersion.split('.')
    for (let i = 0; i < splited.length; i++) {
      if (splited[i] > matchedVersion[i]) {
        isOldMacVersion = false
        break
      } else if (splited[i] < matchedVersion[i]) {
        isOldMacVersion = true
        break
      } else if (i === 2 && splited[i] === matchedVersion[i]) {
        isOldMacVersion = true
      }
    }
  } catch (error) {
    // do nothing
  }
}
