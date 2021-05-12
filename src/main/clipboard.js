import clipboard from 'electron-clipboard-extended';
import { buildTextData, buildImageData } from './card-builder';
// import logger from './logger';
// import { showNotification } from './notification';
import { updateClipboardData, addOneClipboardData } from './ipc';
clipboard
  .startWatching()
  .on('text-changed', async () => {
    updateClipboardData(await addOneClipboardData(buildTextData()));
  })
  .on('image-changed', async () => {
    updateClipboardData(await addOneClipboardData(buildImageData()));
  });
