import { Headers } from 'got';
export interface PajbotAPIRequest {
    message: string;
}
export interface PajbotAPIResponse {
    banned: boolean;
    input_message: string;
    banphrase_data?: {
        id: number;
        name: string;
        phrase: string;
        length: number;
        permanent: false;
        operator: 'contains' | 'exact' | 'starts_with' | 'ends_with' | 'regex';
        case_sensitive: boolean;
    };
}
export interface Pajbot2APIResponse {
    banned: boolean;
    message: string;
    filter_data?: {
        mute_type: number;
        reason: string;
    }[];
}
interface Channel {
    name: string;
    url: string;
    v2?: string;
}
interface Config {
    enabled: boolean;
    channels: Channel[];
    headers: Headers;
}
export declare class PajbotAPI {
    channels: Channel[];
    private enabled;
    private readonly headers;
    private logger;
    constructor(config: Config, loggerLevel: string);
    check(channelName: string, message: string): Promise<PajbotAPIResponse | null>;
    checkVersion2(channelName: string, message: string): Promise<Pajbot2APIResponse | null>;
}
export {};
