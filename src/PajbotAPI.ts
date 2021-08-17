import fetch, { Headers } from 'got'
import { Logger } from '@adonisjs/logger/build/standalone'
import { pajbotList } from './pajbotList'

/** [Pajbot API help](https://gist.github.com/pajlada/57464e519ba8d195a97ddcd0755f9715) */
export interface PajbotAPIRequest {
  message: string
}

/** [Pajbot API help](https://gist.github.com/pajlada/57464e519ba8d195a97ddcd0755f9715) */
export interface PajbotAPIResponse {
  banned: boolean
  input_message: string
  banphrase_data?: {
    id: number
    name: string
    phrase: string
    length: number
    permanent: false
    operator: 'contains' | 'exact' | 'starts_with' | 'ends_with' | 'regex'
    case_sensitive: boolean
  }
}

interface Channel {
  name: string
  url: string
}

interface Config {
  enabled: boolean
  channels: Channel[]
  headers: Headers
}

export class PajbotAPI {
  public channels: Channel[]
  private enabled: boolean = false
  private readonly headers: Headers

  private logger: Logger

  constructor (config: Config, loggerLevel: string) {
    if (!config.enabled) {
      return
    }

    this.enabled = true

    // pajbotList has some channels.
    this.channels = config.channels.length ? config.channels : pajbotList
    this.headers = config.headers

    this.logger = new Logger({
      enabled: true,
      name: 'befriendlier-shared-pajbotapi',
      level: loggerLevel,
      prettyPrint: process.env.NODE_ENV === 'development',
    })
  }

  public async check (channelName: string, message: string) {
    if (!this.enabled) {
      return { banned: false } as PajbotAPIResponse
    }

    let channel = this.channels.find(ch => ch.name === channelName)

    if (!channel) {
      // Maybe, just maybe, someone deletes "DEFAULT". So for that reason, HARDCODE IT.
      channel = this.channels.find(ch => ch.name === 'DEFAULT') as Channel || { url: 'https://forsen.tv/api/v1/banphrases/test' }
    }
  
    const request: PajbotAPIRequest = { message }

    try {
      const { body }: any = await fetch.post(channel.url, {
        headers: { ...this.headers },
        body: JSON.stringify(request),
        responseType: 'json',
      })

      return body as PajbotAPIResponse
    } catch (error) {
      this.logger.error({ err: error }, 'PajbotAPI.check()')
      return null
    }
  }
}