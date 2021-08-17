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
    [key: string]: {
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
  throttleInMs: number
  headers: Headers
}

export class PerspectiveAPI {
  private token: string
  private enabled: boolean = false
  private readonly headers: Headers
  private throttleInMs: number
  private logger: Logger
  private nextRequest: Date = new Date()

  constructor (config: Config, loggerLevel: string) {
    if (!config.token) {
      return
    }

    this.enabled = true
    this.token = config.token
    this.headers = config.headers
    this.throttleInMs = config.throttleInMs

    this.logger = new Logger({
      enabled: true,
      name: 'befriendlier-shared-perspectiveapi',
      level: loggerLevel,
      prettyPrint: process.env.NODE_ENV === 'development',
    })
  }

  public async check (msgText: string) {
    if (!this.enabled) {
      return null
    }

    // Set nextRequest.
    this.nextRequest =
      new Date((this.nextRequest.getTime() - new Date().getTime()) + Date.now() + this.throttleInMs + (Math.random() * 10))

    // Wait until nextRequest.
    await new Promise((resolve) => setTimeout(resolve, this.nextRequest.getTime() - new Date().getTime()))

    const searchParams = {
      key: this.token
    }

    const request: PerspectiveAPIRequest = {
      comment: {
        text: msgText
      },
      /** Do not auto detect. */
      languages: ["en"],
      requestedAttributes: {
        TOXICITY: {}
      },
      doNotStore: true
    }

    try {
      const { body }: any = await fetch.post('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze', {
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
}
