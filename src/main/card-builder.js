import { clipboard } from 'electron';
import { defaultHistoryFavorite } from '../shared/env';
import store from '../renderer/store';

class clipboardCardBuilder {
  constructor() {
    this.data = {};
    this.data.copyDate = new Date();
  }

  setFavorite(f) {
    this.data.favorite = f;
    return this;
  }

  setIcon(icon) {
    this.data.icon = icon;
    return this;
  }

  getData() {
    return this.data;
  }
}

export class TextDataBuilder extends clipboardCardBuilder {
  constructor() {
    super();
    this.data.cardType = 'Text';
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
    this.data.cardType = 'Image';
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
    this.data.cardType = 'Link';
  }

  setMainData(text) {
    this.data.text = text.trim();
    return this;
  }
}

export const buildTextData = () => {
  const text = clipboard.readText();
  const rtf = clipboard.readRTF();
  const html = clipboard.readHTML();
  const isLink = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/.test(
    text.trim()
  );
  if (isLink) {
    return new LinkDataBuilder()
      .setFavorite(defaultHistoryFavorite)
      .setMainData(text.trim())
      .getData();
  } else {
    const regexList = store.state.appConfig.regexList;
    for (const regex of regexList) {
      if (new RegExp(regex).test(text)) return;
    }
    return new TextDataBuilder()
      .setFavorite(defaultHistoryFavorite)
      .setMainData(text, rtf, html)
      .getData();
  }
};
export const buildImageData = () => {
  const image = clipboard.readImage();
  return new ImageDataBuilder()
    .setFavorite(defaultHistoryFavorite)
    .setMainData(image)
    .getData();
};
