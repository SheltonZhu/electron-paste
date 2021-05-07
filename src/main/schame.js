export const clipboardCardIconSchema = {
  type: 'object',
  properties: {
    content: {
      type: 'string',
    },
    id: {
      type: 'string',
    },
  },
  required: ['content', 'id'],
  additionalProperties: false,
};

export const clipboardCardSchema = {
  type: 'object',
  properties: {
    favorite: {
      type: 'string',
    },
    type: {
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
  required: ['type', 'copyDate'],
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
    sort: {
      type: 'number',
    },
  },
  required: ['name', 'color', 'sort'],
  additionalProperties: false,
};
