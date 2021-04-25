import clipboard from 'electron-clipboard-extended'
import { showNotification } from './notification'

clipboard
  .startWatching()
  .on('text-changed', async () => {
    const copiedText = clipboard.readText()
    showNotification(`复制了： ${copiedText}`, '复制成功！')

    //   let isLink = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/.test(
    //     currentText.trim()
    //   )
    //   let data = {
    //     table: 'historyData',
    //     copyType: 'Text',
    //     copyTime: new Date(),
    //     copyContent: currentText,
    //     otherInfo: { characterLength: currentText.length }
    //   }
    //   if (isLink) {
    //     data.copyType = 'Link'
    //     data.copyContent = data.copyContent.trim()
    //   } else {
    //     let regexList = config.get('regexList')
    //     for (let regex of regexList) {
    //       if (new RegExp(regex).test(data.copyContent)) return
    //     }
    //   }
    //   let base64Icon = getCurrentWindowIcon()
    //   try {
    //     let isExist;
    //     [data.checksum, isExist] = await cardIconDb.getChecksumAndExist(
    //       base64Icon
    //     )
    //     if (!isExist) {
    //       await cardIconDb.create({
    //         content: base64Icon,
    //         checksum: data.checksum
    //       })
    //     }
    //
    //     MainWindow.browserWindow.webContents.send('clipboard-text-changed', {
    //       data: await db.create(data),
    //       isExist: isExist
    //     })
    //   } catch (e) {
    //     log.error(e)
    //   }
  })
// .on('image-changed', async () => {
//   // const window = windowManager.getActiveWindow();
//   let currentImage = clipboard.readImage()
//   let image = {
//     table: 'historyData',
//     copyType: 'Image',
//     copyTime: new Date(),
//     copyContent: currentImage.toDataURL(),
//     otherInfo: currentImage.getSize()
//   }
//   try {
//     let base64Icon = getCurrentWindowIcon()
//     let isExist;
//     [image.checksum, isExist] = await cardIconDb.getChecksumAndExist(
//       base64Icon
//     )
//     if (!isExist) {
//       await cardIconDb.create({
//         content: base64Icon,
//         checksum: image.checksum
//       })
//     }
//
//     MainWindow.browserWindow.webContents.send('clipboard-image-changed', {
//       data: await db.create(image),
//       isExist: isExist
//     })
//   } catch (e) {
//     log.error(e);
//   }
// })
export default clipboard
