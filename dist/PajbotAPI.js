"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PajbotAPI = void 0;
const got_1 = __importDefault(require("got"));
const standalone_1 = require("@adonisjs/logger/build/standalone");
const pajbotList_1 = require("./pajbotList");
const _default_ = {
    url: 'https://forsen.tv/api/v1/banphrases/test',
    v2: 'https://paj.pajbot.com/api/channel/22484632/moderation/check_message',
};
class PajbotAPI {
    constructor(config, loggerLevel) {
        this.enabled = false;
        if (!config.enabled) {
            return;
        }
        this.enabled = true;
        this.channels = config.channels.length ? config.channels : pajbotList_1.pajbotList;
        this.headers = config.headers;
        this.logger = new standalone_1.Logger({
            enabled: true,
            name: 'befriendlier-shared-pajbotapi',
            level: loggerLevel,
            prettyPrint: process.env.NODE_ENV === 'development',
        });
    }
    async check(channelName, message) {
        if (!this.enabled) {
            return { banned: false };
        }
        let channel = this.channels.find(ch => ch.name === channelName);
        if (!channel) {
            channel = this.channels.find(ch => ch.name === 'DEFAULT') || { url: _default_.url };
        }
        const request = { message };
        try {
            const { body } = await got_1.default.post(channel.url, {
                headers: { ...this.headers },
                body: JSON.stringify(request),
                responseType: 'json',
            });
            return body;
        }
        catch (error) {
            this.logger.error({ err: error }, 'PajbotAPI.check()');
            return null;
        }
    }
    async checkVersion2(channelName, message) {
        if (!this.enabled) {
            return { banned: false };
        }
        let channel = this.channels.find(ch => ch.name === channelName);
        if (!channel) {
            channel = this.channels.find(ch => ch.name === 'DEFAULT') || { v2: _default_.v2 };
        }
        if (!channel.v2) {
            channel.v2 = _default_.v2;
        }
        try {
            const { body } = await got_1.default.get(channel.v2 + `?message=${message}`, {
                headers: { ...this.headers },
                responseType: 'json',
            });
            return body;
        }
        catch (error) {
            this.logger.error({ err: error }, 'PajbotAPI.checkVersion2()');
            return null;
        }
    }
}
exports.PajbotAPI = PajbotAPI;
//# sourceMappingURL=PajbotAPI.js.map