// 由`ipc-main`发出 使用HTML5降级通知
export const EVENT_APP_NOTIFY_MAIN = 'app.notify.main';

// 由`ipc-renderer`发出 显示通知
export const EVENT_APP_NOTIFY_RENDERER = 'app.notify.renderer';

// 由`ipc-renderer`发出 隐藏窗口
export const EVENT_APP_HIDE_WINDOW_CLIPBOARD = 'app.hide.window.clipboard';

// 由`ipc-main`发出 打开并跳转到指定的页面
export const EVENT_APP_SHOW_PAGE = 'app.show.page';

// 由`ipc-renderer`发出 用于获取系统初始化数据
export const EVENT_APP_WEB_INIT = 'app.init.web';

// 由`ipc-renderer`发出 用于选择本地文件/目录
export const EVENT_APP_OPEN_DIALOG = 'app.open.dialog';

// 由`ipc-main`发出 同步`rx`数据
export const EVENT_RX_SYNC_MAIN = 'rx.sync.main';

// 由`ipc-renderer`发出 同步`rx`数据
export const EVENT_RX_SYNC_RENDERER = 'rx.sync.renderer';

// 由`ipc-main`发出 `main`进程报错
export const EVENT_APP_ERROR_MAIN = 'app.error.main';

// 由`ipc-main`发出 切换menu显示
export const EVENT_APP_TOGGLE_MENU = 'app.toggle.menu';

// 由`ipc-renderer`发出 自动粘贴
export const EVENT_APP_CLIPBOARD_PASTE = 'app.clipboard.paste';

export const EVENT_APP_CHANGE_BIND = 'app.change.bind';

export const EVENT_APP_OPEN_WINDOW_SETTING = 'app.open.window.setting';

export const EVENT_APP_CLIPBOARD_DATA_LIST = 'app.clipboard.data.list';

export const EVENT_APP_CLIPBOARD_DATA_CLEAR = 'app.clipboard.data.clear';

export const EVENT_APP_CHECK_HISTORY_CAPACITY = 'app.check.history.capacity';

export const EVENT_APP_FAVORITE_DATA_LIST = 'app.favorite.data.list';

export const EVENT_APP_FAVORITE_DATA_ADD = 'app.favorite.data.add';

export const EVENT_APP_FAVORITE_DATA_MOVE = 'app.favorite.data.move';

export const EVENT_APP_FAVORITE_DATA_UPDATE = 'app.favorite.data.update';

export const EVENT_APP_FAVORITE_DATA_REMOVE = 'app.favorite.data.remove';
