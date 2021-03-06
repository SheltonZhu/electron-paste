const builder = require('electron-builder');
const os = require('os');
const pkg = require('../package.json');

const platform = os.platform();
const Platform = builder.Platform;
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const END = '\x1b[0m';

let targets;

function release() {
  let files = [
    'dist/electron/**/*',
    '!dist/electron/fonts/element-icons--fonts.ttf',
    '!dist/electron/fonts/element-icons--fonts.woff',
    // "!node_modules/{babel-runtime,batch-processor,core-js,deepmerge,element-resize-detector,mousetrap,rxjs,vue*`}${/*}",
    // "!node_modules/unbzip2-stream/dist${/*}",
    // "node_modules/mousetrap/{mousetrap.js,package.json}",
    '!**/*.{md,markdown,MD,txt}',
    '!**/{test.js,license,LICENSE,.jscsrc}',
    '!**/sample?(s)${/*}',
  ];
  const macImages = [];
  const winImages = [];
  switch (platform) {
    case 'darwin':
      targets = Platform.MAC.createTarget();
      files = files.concat(winImages);
      break;
    case 'win32':
      targets = Platform.WINDOWS.createTarget();
      files = files.concat(macImages);
      break;
    case 'linux':
      targets = Platform.LINUX.createTarget();
      files = files.concat(macImages);
  }
  return builder
    .build({
      targets: targets,
      config: {
        productName: 'Electron Paste',
        appId: 'sheltonzhu.github.io',
        compression: 'normal',
        copyright: 'Copyright © 2021 SheltonZhu',
        files: files,
        directories: {
          output: 'build',
        },
        publish: {
          provider: 'github',
          url: pkg.homepage,
        },
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications',
            },
            {
              x: 130,
              y: 150,
              type: 'file',
            },
          ],
        },
        mac: {
          icon: 'build/icons/icon.icns',
          category: 'public.app-category.developer-tools',
          artifactName: 'Electron-Paste-${version}.${ext}',
          target: ['zip', 'dmg'],
          extendInfo: {
            LSUIElement: 'YES',
          },
        },
        win: {
          icon: 'build/icons/icon.ico',
          artifactName: 'Electron-Paste-${version}.Setup.${ext}',
          target: [
            {
              target: 'nsis',
              arch: ['ia32', 'x64'],
            },
          ],
        },
        nsis: {
          license: 'LICENSE',
          oneClick: false,
          perMachine: false,
          allowToChangeInstallationDirectory: true,
          installerIcon: 'build/icons/icon.ico', // 安装图标
          uninstallerIcon: 'build/icons/icon.ico', //卸载图标
          installerHeaderIcon: 'build/icons/icon.ico', // 安装时头部图标
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          shortcutName: 'Electron Paste', // 图标名称
        },
        linux: {
          icon: 'build/icons',
          artifactName: 'Electron-Paste-${version}.${ext}',
          category: 'Utility',
          synopsis: pkg.description,
          target: ['deb', 'rpm', 'tar.gz', 'appImage'],
          desktop: {
            Name: 'electron-paste',
            Encoding: 'UTF-8',
            Type: 'Application',
            Comment: pkg.description,
            StartupWMClass: 'electron-paste',
          },
        },
        appImage: {
          license: 'LICENSE',
        },
      },
    })
    .then(() => {
      console.log(`${BLUE}Done${END}`);
    })
    .catch((error) => {
      console.error(`${YELLOW}Build error: ${error}${END}`);
    });
}

module.exports = release;
