import fetch, { Headers } from 'got'
import { Logger } from '@adonisjs/logger/build/standalone'

/** [PerspectiveAPI documentation](https://github.com/conversationai/perspectiveapi/blob/master/2-api/methods.md#analyzecomment-request) */
export interface PerspectiveAPIRequest {
  comment: {
    text: string
    type?: 'PLAIN_TEXT' | 'HTML'
  },
  context?: {
    entries: {
      text: string
      type: string
    }[]
  },
  requestedAttributes: {
    [key: string]: {
      scoreType?: string
      /** Float */
      scoreThreshold?: number
    }
  }
  languages?: string[]
  doNotStore?: boolean
  clientToken?: string
  sessionId?: string
}

/** [PerspectiveAPI documentation](https://github.com/conversationai/perspectiveapi/blob/master/2-api/methods.md#analyzecomment-response) */
export interface PerspectiveAPIResponse {
  attributeScores: {
    string: {
      summaryScore: {
        /** Float */
        value: number
        type: string
      },
      spanScores: {
        begin: number
        end: number
        score: {
           /** Float */
           value: number
           type: string
        }
      }[]
    }
  },
  languages?: string[]
  clientToken?: string
}

interface Config {
  token: string
  headers: Headers
}

export class PerspectiveAPI {
  private token: string
  private enabled: boolean
  private readonly headers: Headers
  private logger: Logger

  constructor (config: Config, loggerLevel: string) {
    if (config.token) {
    this.token = config.token
      this.enabled = true
      this.headers = config.headers
      this.logger = new Logger({
        enabled: true,
        name: 'befriendly-shared-perspectiveapi',
        level: loggerLevel,
        prettyPrint: process.env.NODE_ENV === 'development',
      })
    }
  }

  public async check (msgText: string) {
    if (this.enabled) {
      const searchParams = {
        key: this.token
      }

      const request: PerspectiveAPIRequest = {
        comment: {
          text: msgText
        },
        /** Auto detect for now. */
        // languages: ["en"],
        requestedAttributes: {
          TOXICITY: {}
        }
      }

      try {
        const { body }: any = await fetch.post(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze`, {
          headers: { ...this.headers },
          searchParams,
          body: JSON.stringify(request),
          responseType: 'json',
        })
        return body as PerspectiveAPIResponse
      } catch (error) {
        this.logger.error({ err: error }, 'PerspectiveAPI.check()')
        return null
      }
    }
    return null
  }
}
