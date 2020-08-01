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
      name: 'befriendly-shared',
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
      this.logger.error('Twitch.requestToken(): %O', error.response.body)
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
      this.logger.error('Twitch.requestAppToken(): %O', error.response.body)
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
      this.logger.error('Twitch.getUser(): %O', error.response.body)
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
      this.logger.error('Twitch.refreshToken(): %O', error.response.body)
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
      this.logger.error('Twitch.validateToken() %O', error.response.body)
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
}
