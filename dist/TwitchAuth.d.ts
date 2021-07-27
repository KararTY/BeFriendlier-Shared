import { Headers } from 'got';
export interface TwitchUsersBody {
    id: string;
    login: string;
    display_name: string;
    type: 'staff' | 'admin' | 'global_mod' | '';
    broadcaster_type: 'partner' | 'affiliate' | '';
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
}
export interface TwitchStreamsBody {
    id: string;
    user_id: string;
    user_name: string;
    game_id: string;
    type: 'live' | '';
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
}
export interface TwitchAuthBody {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string[];
    token_type: string;
}
export interface TwitchValidateBody {
    client_id: string;
    expires_in: number;
    login: string;
    scope: string[];
    user_id: string;
}
export interface TwitchGlobalEmotes {
    id: string;
    name: string;
    images: {
        url_1x: string;
        url_2x: string;
        url_4x: string;
    };
}
interface Config {
    clientToken: string;
    clientSecret: string;
    redirectURI: string;
    scope: string[];
    headers: Headers;
}
export declare class TwitchAuth {
    private readonly clientToken;
    private readonly clientSecret;
    private readonly redirectURI;
    private readonly scope;
    private readonly headers;
    private readonly logger;
    constructor(config: Config, loggerLevel: string);
    requestToken(code: string): Promise<TwitchAuthBody | null>;
    requestAppToken(): Promise<TwitchAuthBody | null>;
    getUser(token: string): Promise<TwitchUsersBody | null>;
    getUser(token: string, usernames?: string[]): Promise<TwitchUsersBody[] | null>;
    getStream(token: string, usernames: string[]): Promise<TwitchStreamsBody[] | null>;
    refreshToken(token: string): Promise<TwitchAuthBody | null>;
    validateToken(token: string): Promise<TwitchValidateBody | null>;
    authorizationURL(csrfToken: string): string;
    getGlobalEmotes(token: string): Promise<TwitchGlobalEmotes[] | null>;
}
export {};
