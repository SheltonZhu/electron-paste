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
import logger from './logger';

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
  db.list = () => {
    return db.find({}, { createdAt: -1, updatedAt: -1 }).sort({ createdAt: 1 });
  };
  db.removeOne = (_id) => {
    return db.remove({ _id }, {});
  };
  db.updateById = (_id, data) => {
    return db.update({ _id }, { $set: data }, { returnUpdatedDocs: true });
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

favorites.removeAndUpdateSort = async (data) => {
  const ret = await favorites
    .find({ sort: { $gt: data.sort } })
    .sort({ sort: 1 });
  for (const idx in ret) {
    const item = ret[idx];
    await favorites.updateById(item._id, { sort: item.sort - 1 });
  }
  return await favorites.removeOne(data._id);
};

favorites.updateSort = async (list) => {
  for (const idx in list) {
    const item = list[idx];
    await favorites.updateById(item._id, { sort: parseInt(idx) + 1 });
  }
};

favorites.listBySort = async () => {
  return favorites.find({}, { createdAt: -1, updatedAt: -1 }).sort({ sort: 1 });
};

clipboardCard.checkHistoryCapacity = async () => {
  const hcm = store.state.appConfig.historyCapacityNum;
  if (hcm === '∞') return 0;
  const qs = await clipboardCard
    .find({ favorite: defaultHistoryFavorite })
    .sort({ copyDate: -1 })
    .limit(hcm);
  if (qs.length < hcm) return 0;
  const affectedNum = await clipboardCard.remove(
    {
      favorite: defaultHistoryFavorite,
      copyDate: { $lt: qs.pop().copyDate },
    },
    { multi: true }
  );
  logger.debug(`[db][add] clear ${affectedNum} record.`);
  return affectedNum;
};

clipboardCard.add = async (data) => {
  const ret = await clipboardCard.create(data);
  if (data.favorite === defaultHistoryFavorite) {
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
        queryObj.cardType = { $ne: CARD_TYPE.IMAGE };
      }
      queryObj['$or'] = [
        { name: { $regex: new RegExp(`.*${query}.*`, 'i') } },
        { text: { $regex: new RegExp(`.*${query}.*`, 'i') } },
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

clipboardCardIcon.isExist = async (base64data) => {
  const checksum = clipboardCardIcon.md5(base64data);
  return [checksum, (await clipboardCardIcon.count({ checksum })) > 0];
};
clipboardCardIcon.getIconMap = async () => {
  const iconMap = {};
  for (const icon of await clipboardCardIcon.list()) {
    iconMap[icon.checksum] = icon.base64data;
  }
  return iconMap;
};

const db = {
  clipboardCard: clipboardCard,
  clipboardCardIcon: clipboardCardIcon,
  favorites: favorites,
};
export default db;
