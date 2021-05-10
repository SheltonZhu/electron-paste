import Datastore from 'nedb-promises';
import path from 'path';
import Ajv from 'ajv';
import { appConfigDir } from './bootstrap';
import {
  clipboardCardSchema,
  favoritesSchema,
  clipboardCardIconSchema,
} from './schame';
import { CARD_TYPE } from '../shared/env';
import md5 from 'md5';
import { defaultHistoryFavorite } from '../shared/env';
import store from '../renderer/store';

const dbFactory = (file, scheme) => {
  const db = new Datastore({
    filename: `${path.join(appConfigDir)}/data/${file}`,
    autoload: true,
    timestampData: true,
  });
  const ajv = new Ajv({
    allErrors: true,
    useDefaults: true,
  });
  db.schemaValidator = ajv.compile(scheme);
  db.validate = (data) => {
    return db.schemaValidator(data);
  };
  db.create = (data) => {
    const isValid = db.validate(data);
    if (isValid) {
      return db.insert(data);
    } else {
      throw new Error(`data valid fail: ${JSON.stringify(data)}`);
    }
  };
  db.md5 = (text) => {
    return md5(text);
  };
  return db;
};

const favorites = dbFactory('favorites.db', favoritesSchema);
const clipboardCard = dbFactory('clipboard_card.db', clipboardCardSchema);
const clipboardCardIcon = dbFactory(
  'clipboard_card_icon.db',
  clipboardCardIconSchema
);

clipboardCard.checkHistoryCapacity = async () => {
  const hcm = store.state.appConfig.historyCapacityNum;
  const qs = await clipboardCard
    .find({ favorite: defaultHistoryFavorite })
    .sort({ copyDate: -1 })
    .limit(hcm);
  if (qs.length < hcm) return 0;
  return await clipboardCard.remove(
    {
      favorite: defaultHistoryFavorite,
      copyDate: { $lt: qs.pop().copyDate },
    },
    { multi: true }
  );
};

clipboardCard.add = async (data) => {
  const ret = await clipboardCard.create(data);
  if (data.favorites === defaultHistoryFavorite) {
    await clipboardCard.checkHistoryCapacity();
  }
  return ret;
};

clipboardCard.list = async (favorite, query, cardType) => {
  const queryObj = {};
  queryObj.favorite = favorite;
  if (cardType) {
    queryObj.cardType = cardType;
  }
  if (query && query.trim()) {
    if (cardType !== CARD_TYPE.IMAGE) {
      if (!cardType) {
        queryObj.copyType = { $ne: CARD_TYPE.IMAGE };
      }
      queryObj['$or'] = [
        { name: { $regex: new RegExp(`.*${query}.*`, 'i') } },
        { copyContent: { $regex: new RegExp(`.*${query}.*`, 'i') } },
      ];
    }
  }
  return await clipboardCard
    .find(queryObj, { createdAt: -1, updatedAt: -1 })
    .sort({ copyDate: -1 })
    .exec();
};
clipboardCard.clear = async (favorite) => {
  return await clipboardCard.remove({ favorite }, { multi: true });
};
const db = {
  clipboardCard: clipboardCard,
  clipboardCardIcon: clipboardCardIcon,
  favorites: favorites,
};
export default db;
