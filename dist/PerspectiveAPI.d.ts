import { Headers } from 'got';
export interface PerspectiveAPIRequest {
    comment: {
        text: string;
        type?: 'PLAIN_TEXT' | 'HTML';
    };
    context?: {
        entries: {
            text: string;
            type: string;
        }[];
    };
    requestedAttributes: {
        [key: string]: {
            scoreType?: string;
            scoreThreshold?: number;
        };
    };
    languages?: string[];
    doNotStore?: boolean;
    clientToken?: string;
    sessionId?: string;
}
export interface PerspectiveAPIResponse {
    attributeScores: {
        string: {
            summaryScore: {
                value: number;
                type: string;
            };
            spanScores: {
                begin: number;
                end: number;
                score: {
                    value: number;
                    type: string;
                };
            }[];
        };
    };
    languages?: string[];
    clientToken?: string;
}
interface Config {
    token: string;
    headers: Headers;
}
export declare class PerspectiveAPI {
    private token;
    private enabled;
    private readonly headers;
    private logger;
    constructor(config: Config, loggerLevel: string);
    check(msgText: string): Promise<PerspectiveAPIResponse | null>;
}
export {};
