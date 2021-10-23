interface Context {
  baseUrl: string
  uri?: string
  queryParams?: KeyValue
}

interface KeyValue {
  [key: string]: any
}

interface HttpClientOptions {
  baseUrl?: string
  beforeUrlHandler?(ctx: Context): Context
  urlHandler?(baseUrl: string, uri: string, queryParams: any): string
  beforeRequestHandler?(ctx: Context, request: RequestInit): Promise<RequestInit>
  requestHandler?(ctx: Context, request: RequestInit): Promise<RequestInit>
  responseHandler?(response: Response): Promise<any>
  afterResponseHandler?(result: any): any
  get?(uri: string, query: KeyValue): Promise<any>
  post?(uri: string, body?: KeyValue, query?: KeyValue, headers?: KeyValue): Promise<any>
  put?(uri: string, body: KeyValue, query?: KeyValue): Promise<any>
  patch?(uri: string, body: KeyValue, query?: KeyValue): Promise<any>
  delete?(uri: string, query?: KeyValue): Promise<any>
}

export class HttpClient {
  static _instance: HttpClient
  static defaultHeaders = { 'Content-Type': 'application/json' }

  isJson(str = 'null') {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  options: HttpClientOptions = {
    baseUrl: '',
    beforeUrlHandler: (ctx) => {
      return ctx
    },
    urlHandler: (baseUrl, uri, queryParams = {}) => {
      const ctx = { baseUrl, uri, queryParams }
      if (this.options.beforeUrlHandler) {
        this.options.beforeUrlHandler(ctx)
      }
      let url = `${ctx.baseUrl}${ctx.uri}`
      if (uri.includes('://')) {
        url = uri
      }
      const queryStr = this._queryParamsToString(queryParams)
      if (queryStr) {
        return `${url}?${queryStr}`
      }
      return url
    },
    beforeRequestHandler: async (_, request) => {
      return request
    },
    requestHandler: async (ctx, request) => {
      if (this.options.beforeRequestHandler) {
        request = await this.options.beforeRequestHandler(ctx, request)
      }
      return request
    },
    responseHandler: (response: Response) => {
      return response.text().then((text) => {
        let data: any = text
        if (this.isJson(text)) {
          data = JSON.parse(text)
        }

        if (!response.ok) {
          const error = (data && data.message) || response.statusText
          return Promise.reject(error)
        }
        if (this.options.afterResponseHandler) {
          return this.options.afterResponseHandler({ data })
        }
      })
    },
    afterResponseHandler: (result: any) => {
      return result
    },
  }

  _queryParamsToString(params: KeyValue) {
    const urlParams = new URLSearchParams()
    for (let k in params) {
      urlParams.append(k, params[k])
    }
    return urlParams.toString()
  }

  constructor(config: HttpClientOptions | undefined) {
    Object.assign(this.options, config || {})
  }

  async get(uri: string, query?: KeyValue) {
    let url = ''
    if (this.options.urlHandler) {
      const baseUrl = this.options.baseUrl || ''
      url = this.options.urlHandler(baseUrl, uri, query)
      const ctx = { baseUrl: url }
      let request
      if (this.options.requestHandler) {
        request = await this.options.requestHandler(ctx, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            ...HttpClient.defaultHeaders,
          },
        })
        return fetch(url, request).then(this.options.responseHandler)
      }
    }
  }

  async post(uri: string, body?: KeyValue, query?: KeyValue, headers: KeyValue = {}) {
    let url = ''
    if (this.options.urlHandler) {
      const baseUrl = this.options.baseUrl || ''
      url = this.options.urlHandler(baseUrl, uri, query)
      const ctx = { baseUrl: url }
      if (this.options.requestHandler) {
        const request = await this.options.requestHandler(ctx, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            ...HttpClient.defaultHeaders,
            ...headers,
          },
          body: JSON.stringify(body),
        })
        return fetch(url, request).then(this.options.responseHandler)
      }
    }
  }

  async put(uri: string, body: KeyValue, query?: KeyValue) {
    let url = ''
    if (this.options.urlHandler) {
      const baseUrl = this.options.baseUrl || ''
      url = this.options.urlHandler(baseUrl, uri, query)
      const ctx = { baseUrl: url }
      if (this.options.requestHandler) {
        const request = await this.options.requestHandler(ctx, {
          method: 'PUT',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            ...HttpClient.defaultHeaders,
          },
          body: JSON.stringify(body),
        })
        return fetch(url, request).then(this.options.responseHandler)
      }
    }
  }

  async patch(uri: string, body: KeyValue, query?: KeyValue) {
    let url = ''
    if (this.options.urlHandler) {
      const baseUrl = this.options.baseUrl || ''
      url = this.options.urlHandler(baseUrl, uri, query)
      const ctx = { baseUrl: url }
      if (this.options.requestHandler) {
        const request = await this.options.requestHandler(ctx, {
          method: 'PATCH',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            ...HttpClient.defaultHeaders,
          },
          body: JSON.stringify(body),
        })
        return fetch(url, request).then(this.options.responseHandler)
      }
    }
  }

  async delete(uri: string, query?: KeyValue) {
    let url = ''
    if (this.options.urlHandler) {
      const baseUrl = this.options.baseUrl || ''
      url = this.options.urlHandler(baseUrl, uri, query)
      const ctx = { baseUrl: url }
      if (this.options.requestHandler) {
        const request = await this.options.requestHandler(ctx, {
          method: 'DELETE',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            ...HttpClient.defaultHeaders,
          },
        })
        return fetch(url, request).then(this.options.responseHandler)
      }
    }
  }

  static instance(config?: HttpClientOptions) {
    if (!this._instance) {
      this._instance = new HttpClient(config)
    }
    return this._instance
  }

  static create(config?: HttpClientOptions) {
    return new HttpClient(config)
  }
}
