export enum MessageType {
  WELCOME = 'W',
  JOINCHAT = 'JC',
  LEAVECHAT = 'LC',
  MATCH = 'M',
  UNMATCH = 'UM',
  ROLLMATCH = 'RM',
  SUCCESS = 'S',
  ADDEMOTES = 'AE',
  ERROR = 'ERR',
  UNREGISTERED = 'UR',
  TAKEABREAK = 'TAB'
}

export interface BASE {
  userTwitch: {
    name: string
    id: string
  }
  channelTwitch: {
    name: string
    id: string
  }
  result?: any
}

export enum More {
  NONE = 'NONE',
  BIO = 'BIO',
  FAVORITEEMOTES = 'FE',
  FAVORITESTREAMERS = 'FS'
}

export interface ROLLMATCH extends BASE {
  more: More
}

export interface UNMATCH extends BASE {
  matchUserTwitch: {
    name: string
    id: string
  }
}
