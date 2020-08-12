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
        this.clientToken = config.clientToken;
        this.clientSecret = config.clientSecret;
        this.redirectURI = config.redirectURI;
        this.scope = config.scope.join(' ');
        this.headers = config.headers;
        this.logger = new standalone_1.Logger({
            enabled: true,
            name: 'befriendly-shared-twitchauth',
            level: loggerLevel,
            prettyPrint: process.env.NODE_ENV === 'development',
        });
    }
    async requestToken(code) {
        const searchParams = {
            client_id: this.clientToken,
            client_secret: this.clientSecret,
            grant_type: 'authorization_code',
            code,
            redirect_uri: this.redirectURI,
            scope: this.scope,
        };
        try {
            const { body } = await got_1.default.post('https://id.twitch.tv/oauth2/token', {
                headers: Object.assign({}, this.headers),
                searchParams,
                responseType: 'json',
            });
            return body;
        }
        catch (error) {
            this.logger.error({ err: error }, 'Twitch.requestToken()');
            return null;
        }
    }
    async requestAppToken() {
        const searchParams = {
            client_id: this.clientToken,
            client_secret: this.clientSecret,
            grant_type: 'client_credentials',
            scope: this.scope,
        };
        try {
            const { body } = await got_1.default.post('https://id.twitch.tv/oauth2/token', {
                headers: Object.assign({}, this.headers),
                searchParams,
                responseType: 'json',
            });
            return body;
        }
        catch (error) {
            this.logger.error({ err: error }, 'Twitch.requestAppToken()');
            return null;
        }
    }
    async getUser(token, usernames) {
        try {
            const { body } = await got_1.default.get(`https://api.twitch.tv/helix/users?${usernames instanceof Array ? usernames.map((i, ind) => ind > 0 ? '&login=' + i : 'login=' + i).join('') : ''}`, {
                headers: Object.assign(Object.assign({}, this.headers), { 'Client-ID': this.clientToken, Authorization: `Bearer ${token}` }),
                responseType: 'json',
            });
            if (usernames instanceof Array) {
                return body.data.length > 0 ? body.data : null;
            }
            else {
                return body.data[0] !== undefined ? body.data[0] : null;
            }
        }
        catch (error) {
            this.logger.error({ err: error }, 'Twitch.getUser()');
            return null;
        }
    }
    async getStream(token, usernames) {
        try {
            const { body } = await got_1.default.get(`https://api.twitch.tv/helix/streams?${usernames instanceof Array ? usernames.map((i, ind) => ind > 0 ? '&user_login=' + i : 'user_login=' + i).join('') : ''}`, {
                headers: Object.assign(Object.assign({}, this.headers), { 'Client-ID': this.clientToken, Authorization: `Bearer ${token}` }),
                responseType: 'json',
            });
            return body.data.length > 0 ? body.data : null;
        }
        catch (error) {
            this.logger.error({ err: error }, 'Twitch.getStream()');
            return null;
        }
    }
    async refreshToken(token) {
        const searchParams = {
            client_id: this.clientToken,
            client_secret: this.clientSecret,
            grant_type: 'refresh_token',
            refresh_token: encodeURI(token),
            scope: this.scope,
        };
        try {
            const { body } = await got_1.default.post('https://id.twitch.tv/oauth2/token', {
                headers: Object.assign({}, this.headers),
                searchParams,
                responseType: 'json',
            });
            return body;
        }
        catch (error) {
            this.logger.error({ err: error }, 'Twitch.refreshToken()');
            return null;
        }
    }
    async validateToken(token) {
        try {
            const { body } = await got_1.default.get('https://id.twitch.tv/oauth2/validate', {
                headers: Object.assign(Object.assign({}, this.headers), { 'Client-ID': this.clientToken, Authorization: `OAuth ${token}` }),
                responseType: 'json',
            });
            return body;
        }
        catch (error) {
            this.logger.error({ err: error }, 'Twitch.validateToken()');
            return null;
        }
    }
    authorizationURL(csrfToken) {
        let url = 'https://id.twitch.tv/oauth2/authorize?response_type=code';
        url += `&client_id=${this.clientToken}`;
        url += `&redirect_uri=${this.redirectURI}`;
        url += `&scope=${this.scope}`;
        url += '&force_verify=true';
        url += `&state=${csrfToken}`;
        return url;
    }
}
exports.TwitchAuth = TwitchAuth;
//# sourceMappingURL=TwitchAuth.js.map