import Datastore from 'nedb-promises'
import path from 'path'
import Ajv from 'ajv'
import { appConfigDir } from './bootstrap'
import {
  clipboardCardSchema,
  favoritesSchema,
  clipboardCardIconSchema
} from './schame'
import md5 from 'md5'

const dbFactory = (file, scheme) => {
  const db = new Datastore({
    filename: `${path.join(appConfigDir)}/data/${file}`,
    autoload: true,
    timestampData: true
  })
  const ajv = new Ajv({
    allErrors: true,
    useDefaults: true
  })
  db.schemaValidator = ajv.compile(scheme)
  db.validate = (data) => {
    return db.schemaValidator(data)
  }
  db.create = (data) => {
    const isValid = db.validate(data)
    if (isValid) {
      return db.insert(data)
    } else {
      throw new Error(`data valid fail: ${JSON.stringify(data)}`)
    }
  }
  db.md5 = (text) => {
    return md5(text)
  }
  return db
}

const db = {
  favorites: dbFactory('favorites.db', favoritesSchema),
  clipboardCard: dbFactory('clipboard_card.db', clipboardCardSchema),
  clipboardCardIcon: dbFactory(
    'clipboard_card_icon.db',
    clipboardCardIconSchema
  )
}
import { defaultHistoryFavorite } from '../shared/env'
import store from '../renderer/store'

db.clipboardCard.checkHistoryCapacity = async () => {
  const hcm = store.state.appConfig.historyCapacityNum
  const qs = await this.clipboardCard.find({ favorite: defaultHistoryFavorite }).sort({ copyDate: -1 }).limit(hcm)
  if (qs.length < hcm) return 0
  return await this.clipboardCard.remove({
    favorite: defaultHistoryFavorite,
    copyDate: { $lt: qs.pop().copyDate }
  }, { multi: true })
}

db.clipboardCard.add = async (data) => {
  const ret = await db.clipboardCard.create(data)
  if (data.favorites === defaultHistoryFavorite) {
    await db.clipboardCard.checkHistoryCapacity()
  }
  return ret
}
export default db
