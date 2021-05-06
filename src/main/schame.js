export const clipboardCardIconSchema = {
  type: 'object',
  properties: {
    content: {
      type: 'string'
    },
    id: {
      type: 'string'
    }
  },
  required: ['content', 'checksum'],
  additionalProperties: false
}

export const clipboardCardSchema = {
  type: 'object',
  properties: {
    favorite: {
      type: 'string'
    },
    type: {
      type: 'string'
    },
    copyDate: {
      type: 'object'
    },
    text: {
      type: 'string'
    },
    rtf: {
      type: 'string'
    },
    html: {
      type: 'string'
    },
    base64data: {
      type: 'string'
    },
    path: {
      type: 'string'
    },
    info: {
      type: 'object'
    },
    name: {
      type: 'string'
    },
    icon: {
      type: 'string'
    }
  },
  required: ['type', 'copyDate', 'text', 'rtf', 'html', 'base64data', 'path'],
  additionalProperties: false
}
export const favoritesSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    color: {
      type: 'string'
    },
    sort: {
      type: 'number'
    }
  },
  required: ['name', 'color', 'sort'],
  additionalProperties: false
}
