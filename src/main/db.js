import Datastore from "nedb-promises";
import path from "path";
import Ajv from "ajv";
import { appConfigDir } from "./bootstrap";
import {
  clipboardCardSchema,
  favoritesSchema,
  clipboardCardIconSchema,
} from "./schame";
import md5 from "md5";

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
    const isValid = this.validate(data);
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

const db = {
  favorites: dbFactory("favorites.db", favoritesSchema),
  clipboardCard: dbFactory("clipboardCard.db", clipboardCardSchema),
  clipboardCardIcon: dbFactory("clipboardCardIcon.db", clipboardCardIconSchema),
};

export default db;
