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
interface Channel {
    name: string;
    url: string;
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
}
export {};
