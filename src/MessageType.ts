export enum MessageType {
  WELCOME = 'W',
  PING = 'P',
  CHATS = 'C',
  JOINCHAT = 'JC',
  LEAVECHAT = 'LC',
  MATCH = 'M',
  UNMATCH = 'UM',
  ROLLMATCH = 'RM',
  SUCCESS = 'S',
  MISMATCH = 'MM',
  EMOTES = 'E',
  ERROR = 'ERR',
  UNREGISTERED = 'UR',
  TAKEABREAK = 'TAB',
  TOKEN = 'T',
  BIO = 'B',
  GIVEEMOTES = 'GE',
  PROFILE = 'PR',
  PROFILES = 'PRS',
  WHISPER = 'WH',
  REGISTER = 'R',
  BATTLE = 'BA',
}

export interface NameAndId {
  name: string
  id: string
}

export interface BASE {
  userTwitch: NameAndId
  channelTwitch: NameAndId
  global?: boolean
  result?: any
}

export enum More {
  NONE = 'NONE',
  BIO = 'BIO',
  FAVORITEEMOTES = 'FE',
  FAVORITESTREAMERS = 'FS'
}

export interface ROLLMATCH extends BASE {
  more?: More
}

export interface UNMATCH extends BASE {
  matchUserTwitch: NameAndId
}

export interface JOINCHAT extends BASE {
  joinUserTwitch: NameAndId
}

export interface LEAVECHAT extends BASE {
  leaveUserTwitch: NameAndId
}

export interface REQUESTRESPONSE {
  requestTime: string
  value: any
}

export interface Token {
  expiration: Date
  superSecret: string
  refreshToken: string
}

export interface Emote {
  name: string
  id: string
  amount?: number
}

export interface EMOTES extends BASE {
  emotes: Emote[]
}

export interface BIO extends BASE {
  bio: string
}

export interface GIVEEMOTES extends BASE {
  recipientUserTwitch: NameAndId
  emotes: Emote[]
}

export interface REGISTER extends BASE {
  userTwitch: NameAndId & {
    avatar: string
    displayName: string
  }
}

export interface BATTLE extends BASE {
  targetUserTwitch: NameAndId
}

export interface PROFILE extends BASE, BIO, EMOTES { }
