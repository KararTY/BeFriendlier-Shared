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
        this.token = config.clientToken;
        this.secret = config.clientSecret;
        this.redirectURI = config.redirectURI;
        this.scopes = config.scopes.join(' ');
        this.headers = config.headers;
        this.logger = new standalone_1.Logger({ enabled: true, name: 'befriendly-shared', level: loggerLevel });
    }
    async requestToken(code) {
        const searchParams = {
            client_id: this.token,
            client_secret: this.secret,
            grant_type: 'authorization_code',
            code,
            redirect_uri: this.redirectURI,
            scope: this.scopes,
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
            this.logger.error(null, 'Twitch.requestToken(): %O', error.response.body);
            return null;
        }
    }
    async getUser(token, usernames) {
        try {
            const { body } = await got_1.default.get(`https://api.twitch.tv/helix/users?${usernames instanceof Array ? usernames.map((i, ind) => ind > 0 ? '&login=' + i : 'login=' + i).join('') : ''}`, {
                headers: Object.assign(Object.assign({}, this.headers), { 'Client-ID': this.token, Authorization: `Bearer ${token}` }),
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
            this.logger.error(null, 'Twitch.getUser(): %O', error.response.body);
            return null;
        }
    }
    async refreshToken(token) {
        const searchParams = {
            client_id: this.token,
            client_secret: this.secret,
            grant_type: 'refresh_token',
            refresh_token: encodeURI(token),
            scope: this.scopes,
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
            this.logger.error(null, 'Twitch.refreshToken(): %O', error.response.body);
            return null;
        }
    }
    async validateToken(token) {
        try {
            const { body } = await got_1.default.get('https://id.twitch.tv/oauth2/validate', {
                headers: Object.assign(Object.assign({}, this.headers), { 'Client-ID': this.token, Authorization: `OAuth ${token}` }),
                responseType: 'json',
            });
            return body;
        }
        catch (error) {
            this.logger.error(null, 'Twitch.validateToken() %O', error.response.body);
            return null;
        }
    }
    authorizationURL(csrfToken) {
        let url = 'https://id.twitch.tv/oauth2/authorize?response_type=code';
        url += `&client_id=${this.token}`;
        url += `&redirect_uri=${this.redirectURI}`;
        url += `&scope=${this.scopes}`;
        url += '&force_verify=true';
        url += `&state=${csrfToken}`;
        return url;
    }
}
exports.TwitchAuth = TwitchAuth;
//# sourceMappingURL=TwitchAuth.js.map