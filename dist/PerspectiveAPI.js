"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerspectiveAPI = void 0;
const got_1 = __importDefault(require("got"));
const logger_1 = require("@adonisjs/logger");
class PerspectiveAPI {
    constructor(config, loggerLevel) {
        this.enabled = false;
        this.nextRequest = new Date();
        if (!config.token) {
            return;
        }
        this.enabled = true;
        this.token = config.token;
        this.headers = config.headers;
        this.throttleInMs = config.throttleInMs;
        this.logger = new logger_1.Logger({
            enabled: true,
            name: 'befriendlier-shared-perspectiveapi',
            level: loggerLevel,
            prettyPrint: process.env.NODE_ENV === 'development',
        });
    }
    async check(msgText) {
        if (!this.enabled) {
            return null;
        }
        this.nextRequest =
            new Date((this.nextRequest.getTime() - new Date().getTime()) + Date.now() + this.throttleInMs + (Math.random() * 10));
        await new Promise((resolve) => setTimeout(resolve, this.nextRequest.getTime() - new Date().getTime()));
        const searchParams = {
            key: this.token
        };
        const request = {
            comment: {
                text: msgText
            },
            languages: ["en"],
            requestedAttributes: {
                TOXICITY: {}
            },
            doNotStore: true
        };
        try {
            const { body } = await got_1.default.post('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze', {
                headers: { ...this.headers },
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
}
exports.PerspectiveAPI = PerspectiveAPI;
//# sourceMappingURL=PerspectiveAPI.js.map