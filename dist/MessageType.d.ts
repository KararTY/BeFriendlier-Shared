export declare enum MessageType {
    WELCOME = "W",
    PING = "P",
    CHATS = "C",
    JOINCHAT = "JC",
    LEAVECHAT = "LC",
    MATCH = "M",
    UNMATCH = "UM",
    ROLLMATCH = "RM",
    SUCCESS = "S",
    MISMATCH = "MM",
    ADDEMOTES = "AE",
    ERROR = "ERR",
    UNREGISTERED = "UR",
    TAKEABREAK = "TAB",
    TOKEN = "T"
}
export interface NameAndId {
    name: string;
    id: string;
}
export interface BASE {
    userTwitch: NameAndId;
    channelTwitch: NameAndId;
    result?: any;
}
export declare enum More {
    NONE = "NONE",
    BIO = "BIO",
    FAVORITEEMOTES = "FE",
    FAVORITESTREAMERS = "FS"
}
export interface ROLLMATCH extends BASE {
    more: More;
}
export interface UNMATCH extends BASE {
    matchUserTwitch: NameAndId;
}
export interface JOINCHAT extends BASE {
    joinUserTwitch: NameAndId;
}
export interface LEAVECHAT extends BASE {
    leaveUserTwitch: NameAndId;
}
export interface REQUESTRESPONSE {
    requestTime: string;
    value: any;
}
export interface ADDEMOTES extends BASE {
    emotes: string[];
}
