import { app, Menu } from "electron";
import * as handler from "./tray-handler";
import { checkUpdate } from "./updater";
import { isMac, isLinux } from "../shared/env";
import pkg from "../../package.json";

let showLinuxMenu = false;
/**
 * 渲染菜单
 */
export default function renderMenu() {
  // mac需要加上默认的一些菜单，否则没法复制粘贴
  let template;
  if (isMac) {
    template = [
      {
        label: app.getName(),
        submenu: [{ role: "about" }, { type: "separator" }, { role: "quit" }],
      },
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          { role: "pasteandmatchstyle" },
          { role: "delete" },
          { role: "selectall" },
        ],
      },
    ];
  } else if (isLinux) {
    if (showLinuxMenu) {
      template = [
        {
          label: "应用",
          submenu: [{ label: "退出", click: handler.exitApp }],
        },
        {
          label: "配置",
          submenu: [{ label: "打开配置文件", click: handler.openConfigFile }],
        },
        {
          label: "帮助",
          submenu: [
            { label: "检查更新", click: () => checkUpdate(true) },
            { label: "查看日志", click: handler.openLog },
            {
              label: "项目主页",
              click: () => {
                handler.openURL(pkg.homepage).then();
              },
            },
            {
              label: "Bug反馈",
              click: () => {
                handler.openURL(pkg.bugs.url).then();
              },
            },
            { label: "打开开发者工具", click: handler.openDevtool },
          ],
        },
      ];
    }
  }
  template && Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

/**
 * 切换是否显示menu
 */
export function toggleMenu() {
  if (isLinux) {
    if (Menu.getApplicationMenu()) {
      showLinuxMenu = false;
      Menu.setApplicationMenu(null);
    } else {
      showLinuxMenu = true;
      renderMenu();
    }
  }
}
