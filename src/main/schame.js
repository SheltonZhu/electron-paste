export const clipboardCardIconSchema = {
  type: 'object',
  properties: {
    base64data: {
      type: 'string',
    },
    checksum: {
      type: 'string',
    },
  },
  required: ['content', 'checksum'],
  additionalProperties: false,
};

export const clipboardCardSchema = {
  type: 'object',
  properties: {
    favorite: {
      type: 'string',
    },
    cardType: {
      // Link, Text, Image, File
      type: 'string',
    },
    copyDate: {
      type: 'object',
    },
    text: {
      type: 'string',
    },
    rtf: {
      type: 'string',
    },
    html: {
      type: 'string',
    },
    base64data: {
      // Image
      type: 'string',
    },
    path: {
      // File
      type: 'string',
    },
    meta: {
      type: 'object',
    },
    name: {
      type: 'string',
    },
    icon: {
      type: 'string',
    },
  },
  required: ['cardType', 'copyDate'],
  additionalProperties: false,
};
export const favoritesSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    color: {
      type: 'string',
    },
  },
  required: ['name', 'color'],
  additionalProperties: false,
};
