"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchAuth = void 0;
const got_1 = __importDefault(require("got"));
const standalone_1 = require("@adonisjs/logger/build/standalone");
class TwitchAuth {
    constructor(config, loggerLevel) {
        if (config.token) {
            this.token = config.token;
            this.enabled = true;
            this.headers = config.headers;
            this.logger = new standalone_1.Logger({
                enabled: true,
                name: 'befriendly-shared-perspectiveapi',
                level: loggerLevel,
                prettyPrint: process.env.NODE_ENV === 'development',
            });
        }
    }
    async check(msgText) {
        if (this.enabled) {
            const searchParams = {
                key: this.token
            };
            const request = {
                comment: {
                    text: msgText
                },
                requestedAttributes: {
                    TOXICITY: {}
                }
            };
            try {
                const { body } = await got_1.default.post(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze`, {
                    headers: Object.assign({}, this.headers),
                    searchParams,
                    body: JSON.stringify(request),
                    responseType: 'json',
                });
                return body;
            }
            catch (error) {
                this.logger.error({ err: error }, 'PerspectiveAPI.check()');
                return null;
            }
        }
        return null;
    }
}
exports.TwitchAuth = TwitchAuth;
