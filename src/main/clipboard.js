import clipboard from 'electron-clipboard-extended';
import { buildTextData, buildImageData } from './card-builder';
import { updateClipboardData, addOneClipboardData } from './ipc';
clipboard
  .startWatching()
  .on('text-changed', async () => {
    updateClipboardData(await addOneClipboardData(await buildTextData()));
  })
  .on('image-changed', async () => {
    updateClipboardData(await addOneClipboardData(await buildImageData()));
  });
