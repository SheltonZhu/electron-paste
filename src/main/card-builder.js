import { clipboard, nativeImage } from 'electron';
import { defaultHistoryFavorite, CARD_TYPE, isWin } from '../shared/env';
import store from '../renderer/store';
import db from './db';
import { getIconMap } from './ipc';

class clipboardCardBuilder {
  constructor() {
    this.data = {};
    this.data.copyDate = new Date();
  }

  setFavorite(f) {
    this.data.favorite = f;
    return this;
  }

  setIcon(checksum) {
    this.data.icon = checksum;
    return this;
  }

  getData() {
    return this.data;
  }
}

export class TextDataBuilder extends clipboardCardBuilder {
  constructor() {
    super();
    this.data.cardType = CARD_TYPE.TEXT;
  }

  setMainData(text, rtf, html) {
    this.data.text = text;
    this.data.rtf = rtf;
    this.data.html = html;
    this.setMeta(text);
    return this;
  }

  setMeta(text) {
    this.data.meta = { charLength: text.length };
    return this;
  }
}

export class ImageDataBuilder extends clipboardCardBuilder {
  constructor() {
    super();
    this.data.cardType = CARD_TYPE.IMAGE;
  }

  setMainData(image) {
    this.data.base64data = image.toDataURL();
    this.setMeta(image);
    return this;
  }

  setMeta(image) {
    this.data.meta = { size: image.getSize() };
    return this;
  }
}

export class LinkDataBuilder extends clipboardCardBuilder {
  constructor() {
    super();
    this.data.cardType = CARD_TYPE.LINK;
  }

  setMainData(text) {
    this.data.text = text.trim();
    return this;
  }
}

export const buildTextData = async () => {
  const text = clipboard.readText();
  const rtf = clipboard.readRTF();
  const html = clipboard.readHTML();
  const isLink = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/.test(
    text.trim()
  );
  const icon = await getChecksum();
  if (isLink) {
    return new LinkDataBuilder()
      .setFavorite(defaultHistoryFavorite)
      .setMainData(text.trim())
      .setIcon(icon)
      .getData();
  } else {
    const regexList = store.state.appConfig.regexList;
    for (const regex of regexList) {
      if (new RegExp(regex).test(text)) return;
    }
    return new TextDataBuilder()
      .setFavorite(defaultHistoryFavorite)
      .setMainData(text, rtf, html)
      .setIcon(icon)
      .getData();
  }
};
export const buildImageData = async () => {
  const image = clipboard.readImage();
  const icon = await getChecksum();
  return new ImageDataBuilder()
    .setFavorite(defaultHistoryFavorite)
    .setMainData(image)
    .setIcon(icon)
    .getData();
};

export function getActiveWinIcon() {
  if (isWin) {
    const { windowManager } = require('node-window-manager');
    const activeWin = windowManager.getActiveWindow();
    const iconBuffer = activeWin.getIcon(32);
    const icon = nativeImage.createFromBuffer(iconBuffer, {
      width: 64,
      height: 64,
    });
    return icon.toDataURL();
  }
  return null;
}

export async function getChecksum() {
  const base64Icon = getActiveWinIcon();
  if (isWin && base64Icon) {
    const [checksum, isExist] = await db.clipboardCardIcon.isExist(base64Icon);
    if (!isExist) {
      await db.clipboardCardIcon.create({ checksum, base64data: base64Icon });
      await getIconMap();
    }
    return checksum;
  }
  return '';
}
