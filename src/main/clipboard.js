import clipboard from 'electron-clipboard-extended';
import { buildTextData, buildImageData } from './card-builder';
import logger from './logger';
// import logger from './logger';
// import { showNotification } from './notification';

clipboard
  .startWatching()
  .on('text-changed', async () => {
    logger.info(buildTextData());
  })
  .on('image-changed', async () => {
    buildImageData();
  });
