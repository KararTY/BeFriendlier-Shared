import fetch, { Headers } from 'got'
import { Logger } from '@adonisjs/logger/build/standalone'

export interface TwitchUsersBody {
  id: string
  login: string
  display_name: string
  type: 'staff' | 'admin' | 'global_mod' | ''
  broadcaster_type: 'partner' | 'affiliate' | ''
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
}

export interface TwitchStreamsBody {
  id: string
  user_id: string
  user_name: string
  game_id: string
  type: 'live' | ''
  title: string
  viewer_count: number
  started_at: string
  language: string
  thumbnail_url: string
}

export interface TwitchAuthBody {
  access_token: string
  refresh_token: string
  expires_in: number
  scope: string[]
  token_type: string
}

export interface TwitchValidateBody {
  client_id: string
  expires_in: number
  login: string
  scope: string[]
  user_id: string
}

export interface TwitchGlobalEmotes {
  id: string
  name: string
  images: {
    url_1x: string
    url_2x: string
    url_4x: string
  }
}

interface Config {
  clientToken: string
  clientSecret: string
  redirectURI: string
  scope: string[]
  headers: Headers
}

export class TwitchAuth {
  private readonly clientToken: string
  private readonly clientSecret: string
  private readonly redirectURI: string
  private readonly scope: string
  private readonly headers: Headers
  private readonly logger: Logger

  constructor (config: Config, loggerLevel: string) {
    this.clientToken = config.clientToken
    this.clientSecret = config.clientSecret
    this.redirectURI = config.redirectURI
    this.scope = config.scope.join(' ')
    this.headers = config.headers
    this.logger = new Logger({
      enabled: true,
      name: 'befriendly-shared-twitchauth',
      level: loggerLevel,
      prettyPrint: process.env.NODE_ENV === 'development',
    })
  }

  public async requestToken (code: string): Promise<TwitchAuthBody | null> {
    const searchParams = {
      client_id: this.clientToken,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectURI,
      scope: this.scope,
    }

    try {
      const { body }: any = await fetch.post('https://id.twitch.tv/oauth2/token', {
        headers: { ...this.headers },
        searchParams,
        responseType: 'json',
      })
      return body
    } catch (error) {
      this.logger.error({ err: error }, 'Twitch.requestToken()')
      return null
    }
  }

  public async requestAppToken (): Promise<TwitchAuthBody | null> {
    const searchParams = {
      client_id: this.clientToken,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials',
      scope: this.scope,
    }

    try {
      const { body }: any = await fetch.post('https://id.twitch.tv/oauth2/token', {
        headers: { ...this.headers },
        searchParams,
        responseType: 'json',
      })
      return body
    } catch (error) {
      this.logger.error({ err: error }, 'Twitch.requestAppToken()')
      return null
    }
  }

  public async getUser (token: string): Promise<TwitchUsersBody | null>
  public async getUser (token: string, usernames?: string[]): Promise<TwitchUsersBody[] | null>
  public async getUser (token: string, usernames?: string[]): Promise<TwitchUsersBody | TwitchUsersBody[] | null> {
    try {
      const { body }: any = await fetch.get(`https://api.twitch.tv/helix/users?${usernames instanceof Array ? usernames.map((i, ind) => ind > 0 ? '&login=' + i : 'login=' + i).join('') : ''}`, {
        headers: {
          ...this.headers,
          'Client-ID': this.clientToken,
          Authorization: `Bearer ${token}`,
        },
        responseType: 'json',
      })

      if (usernames instanceof Array) {
        return body.data.length > 0 ? body.data as TwitchUsersBody[] : null
      } else {
        return body.data[0] !== undefined ? body.data[0] as TwitchUsersBody : null
      }
    } catch (error) {
      this.logger.error({ err: error }, 'Twitch.getUser()')
      return null
    }
  }

  public async getStream (token: string, usernames: string[]): Promise<TwitchStreamsBody[] | null> {
    try {
      const { body }: any = await fetch.get(`https://api.twitch.tv/helix/streams?${usernames instanceof Array ? usernames.map((i, ind) => ind > 0 ? '&user_login=' + i : 'user_login=' + i).join('') : ''}`, {
        headers: {
          ...this.headers,
          'Client-ID': this.clientToken,
          Authorization: `Bearer ${token}`,
        },
        responseType: 'json',
      })

      return body.data.length > 0 ? body.data as TwitchStreamsBody[] : null
    } catch (error) {
      this.logger.error({ err: error }, 'Twitch.getStream()')
      return null
    }
  }

  public async refreshToken (token: string): Promise<TwitchAuthBody | null> {
    const searchParams = {
      client_id: this.clientToken,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: encodeURI(token), // Per https://dev.twitch.tv/docs/authentication/#refreshing-access-tokens:~:text=URL%20encode
      scope: this.scope,
    }

    try {
      const { body }: any = await fetch.post('https://id.twitch.tv/oauth2/token', {
        headers: { ...this.headers },
        searchParams,
        responseType: 'json',
      })

      return body as TwitchAuthBody
    } catch (error) {
      this.logger.error({ err: error }, 'Twitch.refreshToken()')
      return null
    }
  }

  public async validateToken (token: string): Promise<TwitchValidateBody | null> {
    try {
      const { body }: any = await fetch.get('https://id.twitch.tv/oauth2/validate', {
        headers: {
          ...this.headers,
          'Client-ID': this.clientToken,
          Authorization: `OAuth ${token}`,
        },
        responseType: 'json',
      })

      return body as TwitchValidateBody
    } catch (error) {
      this.logger.error({ err: error }, 'Twitch.validateToken()')
      return null
    }
  }

  public authorizationURL (csrfToken: string) {
    let url = 'https://id.twitch.tv/oauth2/authorize?response_type=code'

    url += `&client_id=${this.clientToken}`
    url += `&redirect_uri=${this.redirectURI}`
    url += `&scope=${this.scope}`
    url += '&force_verify=true'
    url += `&state=${csrfToken}`

    return url
  }

  public async getGlobalEmotes (token: string): Promise<TwitchGlobalEmotes[] | null> {
    try {
      const { body }: any = await fetch.get('https://api.twitch.tv/helix/chat/emotes/global', {
        headers: {
          ...this.headers,
          'Client-ID': this.clientToken,
          Authorization: `OAuth ${token}`,
        },
        responseType: 'json',
      })

      return body as TwitchGlobalEmotes[]
    } catch (error) {
      this.logger.error({ err: error }, 'Twitch.validateToken()')
      return null
    }
  }
}
