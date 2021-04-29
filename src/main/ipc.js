import { app, ipcMain, dialog, clipboard } from "electron";
import { readJsonSync } from "fs-extra";
import * as events from "../shared/events";
import { appConfigPath, defaultDownloadDir } from "./bootstrap";
import { updateAppConfig } from "./data";
import { hideWindow as hideClipboard } from "./window-clipboard";
import defaultConfig, { mergeConfig } from "../shared/config";
import { showNotification } from "./notification";
import logger from "./logger";
import robot from "robotjs";
import store from "../renderer/store";

/**
 * ipc-main事件
 */
ipcMain
  .on(events.EVENT_APP_HIDE_WINDOW_CLIPBOARD, () => {
    // 隐藏窗口
    hideClipboard();
  })
  .on(events.EVENT_APP_WEB_INIT, () => {
    // 页面初始化
    let stored;
    try {
      stored = readJsonSync(appConfigPath);
      mergeConfig(stored);
    } catch (e) {
      stored = defaultConfig;
    }
    const res = {
      config: stored,
      meta: {
        version: app.getVersion(),
        defaultDownloadDir,
      },
    };
    store.dispatch("initConfig", res).then();
  })
  .on(events.EVENT_RX_SYNC_RENDERER, (_, data) => {
    // 同步数据
    logger.debug(`received sync data: ${data}`);
    updateAppConfig(data, true);
  })
  .on(events.EVENT_APP_NOTIFY_RENDERER, (_, body, title) => {
    // 显示来自renderer进程的通知
    showNotification(body, title);
  })
  .on(events.EVENT_APP_OPEN_DIALOG, async (e, params) => {
    const ret = await dialog.showOpenDialog(params);
    e.returnValue = ret.filePaths;
  })
  .on("test", (e, copiedText) => {
    clipboard.writeText(copiedText);
    setTimeout(async () => {
      robot.keyTap("v", "control");
    }, 10);
  });
