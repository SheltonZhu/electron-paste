import { net } from 'electron';

const STRING_PROTOTYPE = '[object String]';
const NUMBER_PROTOTYPE = '[object Number]';
const REGEXP_PROTOTYPE = '[object RegExp]';
const DATE_PROTOTYPE = '[object Date]';
const BOOL_PROTOTYPE = '[object Boolean]';
const ARRAY_PROTOTYPE = '[object Array]';
const OBJECT_PROTOTYPE = '[object Object]';
const FUNCTION_PROTOTYPE = '[object Function]';

function protoString(obj) {
  return Object.prototype.toString.call(obj);
}

export function isString(str) {
  return protoString(str) === STRING_PROTOTYPE;
}

export function isNumber(num) {
  return protoString(num) === NUMBER_PROTOTYPE;
}

export function isRegExp(reg) {
  return protoString(reg) === REGEXP_PROTOTYPE;
}

export function isBool(bool) {
  return protoString(bool) === BOOL_PROTOTYPE;
}

export function isDate(date) {
  return protoString(date) === DATE_PROTOTYPE;
}

export function isArray(arr) {
  return protoString(arr) === ARRAY_PROTOTYPE;
}

export function isObject(obj) {
  return protoString(obj) === OBJECT_PROTOTYPE;
}

export function isFunction(fn) {
  return protoString(fn) === FUNCTION_PROTOTYPE;
}

export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * Vue data merge
 * @param  {Object} to      object that want to be merge to
 * @param  {Object} origins origin object sources
 */
export function merge(to, ...origins) {
  origins.forEach((from) => {
    for (const key in from) {
      const value = from[key];
      // Just merge existed property in origin data
      if (to[key] !== undefined) {
        switch (protoString(value)) {
          case OBJECT_PROTOTYPE:
            merge(to[key], value);
            break;
          default:
            to[key] = value;
            break;
        }
      }
    }
  });
}

/**
 * 合并应用配置对象
 * @param {Object} to 待合并的应用配置
 * @param {Object} from 用于合并的应用配置
 * @param {Boolean} appendArray 是否将新数组追加到源数组中而不是覆盖到方式
 */
export function configMerge(to, from, appendArray = false) {
  for (const key in from) {
    const value = from[key];
    switch (protoString(value)) {
      case OBJECT_PROTOTYPE:
        if (to[key] === undefined) {
          to[key] = value;
        } else {
          configMerge(to[key], value, appendArray);
        }
        break;
      // 配置数组采用直接覆盖的形式
      case ARRAY_PROTOTYPE:
        if (appendArray) {
          Array.prototype.push.apply(to[key], from[key]);
        } else {
          to[key] = from[key];
        }
        break;
      default:
        to[key] = value;
        break;
    }
  }
}

/**
 * 获取应用配置对象中发生更新的字段
 * @param {Object} appConfig 当前的应用配置
 * @param {Object} targetConfig 新的应用配置
 */
export function getUpdatedKeys(appConfig = {}, targetConfig) {
  return Object.keys(targetConfig).filter((key) => {
    // 如果原对象类型和新的类型不一致直接返回true
    if (protoString(appConfig[key]) !== protoString(value)) {
      return true;
    }
    const value = targetConfig[key];
    switch (protoString(value)) {
      case OBJECT_PROTOTYPE:
        return getUpdatedKeys(appConfig[key], value).length;
      case ARRAY_PROTOTYPE:
        if (appConfig[key] === value) {
          return false;
        }
        return (
          appConfig[key].length !== value.length ||
          appConfig[key].some(
            (item, index) => getUpdatedKeys(item, value[index]).length > 0
          )
        );
      default:
        return appConfig[key] !== value;
    }
  });
}

// deep assign
export function assign(to, ...origins) {
  origins.forEach((from) => {
    if (!isObject(from)) {
      return;
    }
    for (const key in from) {
      const value = from[key];
      switch (protoString(value)) {
        case OBJECT_PROTOTYPE:
          if (to[key] === undefined) {
            to[key] = {};
          }
          assign(to[key], value);
          break;
        default:
          to[key] = value;
          break;
      }
    }
  });
  return to;
}

// clone obj
export function clone(obj, deep = false) {
  if (obj === undefined || obj === null) {
    return;
  }
  switch (protoString(obj)) {
    case DATE_PROTOTYPE:
      return new Date(obj);
    case REGEXP_PROTOTYPE:
      return new RegExp(obj);
    case ARRAY_PROTOTYPE:
      return !deep ? obj.slice(0) : obj.map((item) => clone(item));
    case OBJECT_PROTOTYPE:
      const r = {};
      for (const key in obj) {
        r[key] = deep ? clone(obj[key], deep) : obj[key];
      }
      return r;
    default:
      return obj;
  }
}

// 生成随机ID
export function generateID() {
  const seed = 'ABCDEF01234567890';
  const arr = [];
  for (let i = 0; i < 32; i++) {
    arr.push(seed[Math.floor(Math.random() * seed.length)]);
  }
  return arr.join('');
}

/**
 * 发起网络请求
 * @param {String} url 请求的路径
 */
export function request(url, fromRenderer) {
  let _net = net;
  if (fromRenderer) {
    const { remote } = require('electron');
    const { net } = remote.require('electron');
    _net = net;
  }
  return new Promise((resolve, reject) => {
    _net
      .request(url)
      .on('response', (response) => {
        const body = [];
        response.on('data', (chunk) => {
          body.push(chunk.toString());
        });
        response.on('end', () => {
          const stringRes = body.join('');
          if (response.headers['content-type'] === 'application/json') {
            try {
              resolve(JSON.parse(stringRes));
            } catch (error) {
              resolve(stringRes);
            }
          } else {
            resolve(stringRes);
          }
        });
      })
      .on('error', reject)
      .end();
  });
}

// dataURL to blob
export function dataURLtoBlob(dataUrl) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
