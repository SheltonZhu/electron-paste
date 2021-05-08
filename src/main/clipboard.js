import clipboard from 'electron-clipboard-extended';
import { buildTextData, buildImageData } from './card-builder';
import logger from './logger';
// import logger from './logger';
// import { showNotification } from './notification';
import db from './db'
clipboard
  .startWatching()
  .on('text-changed', async () => {
    const d = await db.clipboardCard.add(buildTextData())
    logger.info(d);

  })
  .on('image-changed', async () => {
    buildImageData();
  });
