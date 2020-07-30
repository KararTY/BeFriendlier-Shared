"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var got_1 = __importDefault(require("got"));
var standalone_1 = require("@adonisjs/logger/build/standalone");
var TwitchAuth = /** @class */ (function () {
    function TwitchAuth(config, loggerLevel) {
        this.token = config.clientToken;
        this.secret = config.clientSecret;
        this.redirectURI = config.redirectURI;
        this.scopes = config.scopes.join(' ');
        this.headers = config.headers;
        this.logger = new standalone_1.Logger({ enabled: true, name: 'befriendly-shared', level: loggerLevel });
    }
    TwitchAuth.prototype.requestToken = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var searchParams, body, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchParams = {
                            client_id: this.token,
                            client_secret: this.secret,
                            grant_type: 'authorization_code',
                            code: code,
                            redirect_uri: this.redirectURI,
                            scope: this.scopes
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, got_1["default"].post('https://id.twitch.tv/oauth2/token', {
                                headers: __assign({}, this.headers),
                                searchParams: searchParams,
                                responseType: 'json'
                            })];
                    case 2:
                        body = (_a.sent()).body;
                        return [2 /*return*/, body];
                    case 3:
                        error_1 = _a.sent();
                        this.logger.error(null, 'Twitch.requestToken(): %O', error_1.response.body);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TwitchAuth.prototype.getUser = function (token, usernames) {
        return __awaiter(this, void 0, void 0, function () {
            var body, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, got_1["default"].get("https://api.twitch.tv/helix/users?" + (usernames instanceof Array ? usernames.map(function (i, ind) { return ind > 0 ? '&login=' + i : 'login=' + i; }).join('') : ''), {
                                headers: __assign(__assign({}, this.headers), { 'Client-ID': this.token, Authorization: "Bearer " + token }),
                                responseType: 'json'
                            })];
                    case 1:
                        body = (_a.sent()).body;
                        if (usernames instanceof Array) {
                            return [2 /*return*/, body.data.length > 0 ? body.data : null];
                        }
                        else {
                            return [2 /*return*/, body.data[0] !== undefined ? body.data[0] : null];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        this.logger.error(null, 'Twitch.getUser(): %O', error_2.response.body);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TwitchAuth.prototype.refreshToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var searchParams, body, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchParams = {
                            client_id: this.token,
                            client_secret: this.secret,
                            grant_type: 'refresh_token',
                            refresh_token: encodeURI(token),
                            scope: this.scopes
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, got_1["default"].post('https://id.twitch.tv/oauth2/token', {
                                headers: __assign({}, this.headers),
                                searchParams: searchParams,
                                responseType: 'json'
                            })];
                    case 2:
                        body = (_a.sent()).body;
                        return [2 /*return*/, body];
                    case 3:
                        error_3 = _a.sent();
                        this.logger.error(null, 'Twitch.refreshToken(): %O', error_3.response.body);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TwitchAuth.prototype.validateToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var body, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, got_1["default"].get('https://id.twitch.tv/oauth2/validate', {
                                headers: __assign(__assign({}, this.headers), { 'Client-ID': this.token, Authorization: "OAuth " + token }),
                                responseType: 'json'
                            })];
                    case 1:
                        body = (_a.sent()).body;
                        return [2 /*return*/, body];
                    case 2:
                        error_4 = _a.sent();
                        this.logger.error(null, 'Twitch.validateToken() %O', error_4.response.body);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TwitchAuth.prototype.authorizationURL = function (csrfToken) {
        var url = 'https://id.twitch.tv/oauth2/authorize?response_type=code';
        url += "&client_id=" + this.token;
        url += "&redirect_uri=" + this.redirectURI;
        url += "&scope=" + this.scopes;
        url += '&force_verify=true';
        url += "&state=" + csrfToken;
        return url;
    };
    return TwitchAuth;
}());
exports["default"] = TwitchAuth;
