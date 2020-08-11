import { Headers } from 'got';
interface Config {
    token: string;
    headers: Headers;
}
export declare class TwitchAuth {
    private token;
    private enabled;
    private readonly headers;
    private logger;
    constructor(config: Config, loggerLevel: string);
    check(msgText: string): Promise<any>;
}
export {};
