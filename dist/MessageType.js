"use strict";
exports.__esModule = true;
exports.More = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["WELCOME"] = "W";
    MessageType["CHATS"] = "C";
    MessageType["JOINCHAT"] = "JC";
    MessageType["LEAVECHAT"] = "LC";
    MessageType["MATCH"] = "M";
    MessageType["UNMATCH"] = "UM";
    MessageType["ROLLMATCH"] = "RM";
    MessageType["SUCCESS"] = "S";
    MessageType["ADDEMOTES"] = "AE";
    MessageType["ERROR"] = "ERR";
    MessageType["UNREGISTERED"] = "UR";
    MessageType["TAKEABREAK"] = "TAB";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var More;
(function (More) {
    More["NONE"] = "NONE";
    More["BIO"] = "BIO";
    More["FAVORITEEMOTES"] = "FE";
    More["FAVORITESTREAMERS"] = "FS";
    More["MISMATCH"] = "MM";
})(More = exports.More || (exports.More = {}));
