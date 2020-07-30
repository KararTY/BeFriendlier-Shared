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
export interface TwitchAuthBody {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope?: string;
    token_type: string;
}
export interface TwitchValidateBody {
    client_id: string;
    expires_in: number;
    login: string;
    scopes: string[];
    user_id: string;
}
export default class Client {
    private readonly token;
    private readonly secret;
    private readonly redirectURI;
    private readonly scopes;
    private readonly headers;
    private readonly logger;
    constructor(config: any, loggerLevel: string);
    requestToken(code: string): Promise<TwitchAuthBody | null>;
    getUser(token: string): Promise<TwitchUsersBody | null>;
    getUser(token: string, usernames?: string[]): Promise<TwitchUsersBody[] | null>;
    refreshToken(token: string): Promise<TwitchAuthBody | null>;
    validateToken(token: string): Promise<TwitchValidateBody | null>;
    authorizationURL(csrfToken: string): string;
}
