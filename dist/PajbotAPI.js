"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PajbotAPI = void 0;
const got_1 = __importDefault(require("got"));
const standalone_1 = require("@adonisjs/logger/build/standalone");
const pajbotList_1 = require("./pajbotList");
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
            channel = this.channels.find(ch => ch.name === 'DEFAULT') || { url: 'https://forsen.tv/api/v1/banphrases/test' };
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
}
exports.PajbotAPI = PajbotAPI;
//# sourceMappingURL=PajbotAPI.js.map