import { isWin } from './env';
import { dialog as _dialog, remote } from 'electron';
import logger from '../main/logger';

const dialog = _dialog || remote.dialog;

async function choose(
  title,
  filters,
  isFile = true,
  isSave = false,
  defaultPath
) {
  const pathObject = await dialog[isSave ? 'showSaveDialog' : 'showOpenDialog'](
    {
      title,
      defaultPath,
      properties: [isFile ? 'openFile' : 'openDirectory'],
      filters,
      buttonLabel: isSave ? '导出配置' : '导入配置',
    }
  );
  logger.debug('pathObject:', pathObject);

  if (isSave && !pathObject.canceled) {
    return pathObject.filePath;
  } else if (
    pathObject.filePaths &&
    pathObject.filePaths.length &&
    !pathObject.canceled
  ) {
    if (isWin) {
      return pathObject.filePaths[0].replace(/\\/g, '\\\\');
    }
    return pathObject.filePaths[0];
  }
  return null;
}

export function chooseFile(title, filters, defaultPath) {
  return choose(title, filters, true, false, defaultPath);
}

export function chooseSavePath(title, filters, defaultPath) {
  return choose(title, filters, true, true, defaultPath);
}
