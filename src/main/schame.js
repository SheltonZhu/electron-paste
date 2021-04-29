export const clipboardCardIconSchema = {
  type: 'object',
  properties: {
    content: {
      type: 'string'
    },
    checksum: {
      type: 'string'
    }
  },
  required: ['content', 'checksum'],
  additionalProperties: false
}

export const clipboardCardSchema = {
  type: 'object',
  properties: {
    table: {
      type: 'string'
    },
    copyType: {
      type: 'string'
    },
    copyTime: {
      type: 'object'
    },
    copyContent: {
      type: 'string'
    },
    otherInfo: {
      type: 'object'
    },
    name: {
      type: 'string'
    },
    checksum: {
      type: 'string'
    }
  },
  required: ['copyType', 'copyTime', 'copyContent'],
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
    }
  },
  required: ['name', 'color'],
  additionalProperties: false
}
