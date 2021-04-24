import { isLinux } from './env'

const defaultConfig = {
  // 开机自启
  autoLaunch: false,
  // 自动插入
  directPaste: true,
  // 失去焦点隐藏
  enableHideWhenBlur: true,
  // 显示托盘
  enableTrayIcon: true,
  // 剪贴板历史存储数量
  historyCapacity: 1,
  historyCapacityNum: 50,
  // 剪贴板卡片图标
  cardIconEnable: true,
  regexList: [],
  // 背景模糊
  backgroundBlur: true,
  // 开启背景图片
  enableBackgroundPic: true,
  // 背景颜色
  backgroundColor: '#ffffffbf',

  // 收藏便签 字体颜色 选中字体颜色 选中背景颜色
  favoritesFontColor: '#2c3e50',
  favoritesFontColorSelected: '#fff',
  favoritesBgColorSelected: '#b9b9b9d1',

  // 全局快捷键
  globalShortcuts: {
    showClipboard: {
      key: 'Alt+V',
      enable: true
    }

  },
  // 窗口快捷键
  windowShortcuts: {
    toggleMenu: {
      key: isLinux ? 'Ctrl+Shift+B' : '',
      enable: isLinux
    },
    hideClipboard: {
      key: 'Esc',
      enable: false
    }
  }
}

export default defaultConfig

// 合并默认配置，做好配置升级
export function mergeConfig (appConfig) {
  Object.keys(defaultConfig).forEach(key => {
    if (appConfig[key] === undefined || typeof appConfig[key] !== typeof defaultConfig[key]) {
      appConfig[key] = defaultConfig[key]
    } else if (typeof appConfig[key] === 'object') {
      for (const index in appConfig[key]) {
        if (appConfig[key][index] === undefined) {
          appConfig[key][index] = defaultConfig[key][index]
        }
      }
    }
  })
}
