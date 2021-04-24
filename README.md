# Electron-Paste

[中文](README-CN.md)

![](https://img.shields.io/github/languages/top/SheltonZhu/electron-paste.svg?style=flat)
![](https://img.shields.io/github/stars/SheltonZhu/electron-paste.svg?style=social)

This app is a clipboard tool programed by [Electron](https://www.electronjs.org/) and [Vue.js](https://vuejs.org/)
(UI Component: [ElementUI](https://element.eleme.cn/)). It supports Windows only.
(Now supports ubuntu20.04 for some features.)

The design style of this app imitates [Paste](https://pasteapp.io/) on Mac.

## Note for Linux user
By default the `libsodium` maybe not get installed on some platform, for example, the `Fedora`, you can install it manually by command `dnf install libsodium`.

On some systems that use `Gnome` desktop, except `Ubuntu 18.04`, may not have the `AppIndicator` installed, you can manually install this [plugin](https://extensions.gnome.org/extension/615/appindicator-support/) to fix it. (or find it in the store's Add-ons-Shell Extensions)

## Download

<!-- Visit the releases page [Github release](../../releases/latest):

- Windows `electron-ssr-setup-x.x.x.exe`
- Mac `electron-ssr-x.x.x.dmg`
- Linux (recommended) `electron-ssr-x.x.x.AppImage`, double click to run. If you cannot use it or want to download your own system-specific package please use the following options
- Arch or Arch-based distributions `electron-ssr-x.x.x.pacman`
- RedHat derivatives `electron-ssr-x.x.x.rpm`
- Debian derivatives `electron-ssr-x.x.x.deb`
- Other Linux distributions `electron-ssr-x.x.x.tar.gz` -->

<!-- ## Configuration file location

- Windows `C:\Users\{your username}\AppData\Roaming\electron-ssr\gui-config.json`
- Mac `~/Library/Application Support/electron-ssr/gui-config.json`
- Linux `~/.config/gui-config.json` -->

## Application screenshots

<!-- ![](docs/assets/main.jpg) -->

<!-- ## FAQ

[FAQ](./docs/FAQ.md) -->


## Build

``` bash
# or npm install
yarn

# run in development mode
npm run dev

# run in development mode
npm run build

# run the code style check
npm run lint

```

## Changelog

Please check the [release notes](../../releases/latest).

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[1c165f7](https://github.com/SimulatedGREG/electron-vue/tree/1c165f7c5e56edaf48be0fbb70838a1af26bb015) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
