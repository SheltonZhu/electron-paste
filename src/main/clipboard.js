import clipboard from 'electron-clipboard-extended';
import { buildTextData, buildImageData } from './card-builder';
// import logger from './logger';
// import { showNotification } from './notification';
import db from './db';
import { addOneClipboardData } from './ipc';
clipboard
  .startWatching()
  .on('text-changed', async () => {
    addOneClipboardData(await db.clipboardCard.add(buildTextData()));
  })
  .on('image-changed', async () => {
    addOneClipboardData(await db.clipboardCard.add(buildImageData()));
  });
