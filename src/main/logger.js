import { app } from 'electron'
import log from 'electron-log'
import { join } from 'path'
import { ensureDirSync } from 'fs-extra'
import * as Sentry from '@sentry/electron'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({ dsn: "https://2444a54068d944a58a6d4809f27271e1@o578131.ingest.sentry.io/5734190" });
}

const userPath = app.getPath('userData')
const logFolder = join(userPath, 'logs')
ensureDirSync(logFolder)

export const logPath = join(logFolder, 'electron-paste.log')

log.transports.file.file = logPath
log.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s}:{ms} [{level}] {text}'
log.transports.file.maxSize = 5 * 1024 * 1024
log.transports.file.level = 'info'
log.transports.console.format = '{y}-{m}-{d} {h}:{i}:{s}:{ms} [{level}] {text}'
log.transports.console.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug'

export default log
