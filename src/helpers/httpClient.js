export class HttpClient {
    static _instance;
    static defaultHeaders = { 'Content-Type': 'application/json' };
    isJson(str = 'null') {
        try {
            JSON.parse(str);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    options = {
        baseUrl: '',
        beforeUrlHandler: (ctx) => {
            return ctx;
        },
        urlHandler: (baseUrl, uri, queryParams = {}) => {
            const ctx = { baseUrl, uri, queryParams };
            if (this.options.beforeUrlHandler) {
                this.options.beforeUrlHandler(ctx);
            }
            let url = `${ctx.baseUrl}${ctx.uri}`;
            if (uri.includes('://')) {
                url = uri;
            }
            const queryStr = this._queryParamsToString(queryParams);
            if (queryStr) {
                return `${url}?${queryStr}`;
            }
            return url;
        },
        beforeRequestHandler: async (_, request) => {
            return request;
        },
        requestHandler: async (ctx, request) => {
            if (this.options.beforeRequestHandler) {
                request = await this.options.beforeRequestHandler(ctx, request);
            }
            return request;
        },
        responseHandler: (response) => {
            return response.text().then((text) => {
                let data = text;
                if (this.isJson(text)) {
                    data = JSON.parse(text);
                }
                if (!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                }
                if (this.options.afterResponseHandler) {
                    return this.options.afterResponseHandler({ data });
                }
            });
        },
        afterResponseHandler: (result) => {
            return result;
        },
    };
    _queryParamsToString(params) {
        const urlParams = new URLSearchParams();
        for (let k in params) {
            urlParams.append(k, params[k]);
        }
        return urlParams.toString();
    }
    constructor(config) {
        Object.assign(this.options, config || {});
    }
    async get(uri, query) {
        let url = '';
        if (this.options.urlHandler) {
            const baseUrl = this.options.baseUrl || '';
            url = this.options.urlHandler(baseUrl, uri, query);
            const ctx = { baseUrl: url };
            let request;
            if (this.options.requestHandler) {
                request = await this.options.requestHandler(ctx, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        ...HttpClient.defaultHeaders,
                    },
                });
                return fetch(url, request).then(this.options.responseHandler);
            }
        }
    }
    async post(uri, body, query, headers = {}) {
        let url = '';
        if (this.options.urlHandler) {
            const baseUrl = this.options.baseUrl || '';
            url = this.options.urlHandler(baseUrl, uri, query);
            const ctx = { baseUrl: url };
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
                });
                return fetch(url, request).then(this.options.responseHandler);
            }
        }
    }
    async put(uri, body, query) {
        let url = '';
        if (this.options.urlHandler) {
            const baseUrl = this.options.baseUrl || '';
            url = this.options.urlHandler(baseUrl, uri, query);
            const ctx = { baseUrl: url };
            if (this.options.requestHandler) {
                const request = await this.options.requestHandler(ctx, {
                    method: 'PUT',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        ...HttpClient.defaultHeaders,
                    },
                    body: JSON.stringify(body),
                });
                return fetch(url, request).then(this.options.responseHandler);
            }
        }
    }
    async patch(uri, body, query) {
        let url = '';
        if (this.options.urlHandler) {
            const baseUrl = this.options.baseUrl || '';
            url = this.options.urlHandler(baseUrl, uri, query);
            const ctx = { baseUrl: url };
            if (this.options.requestHandler) {
                const request = await this.options.requestHandler(ctx, {
                    method: 'PATCH',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        ...HttpClient.defaultHeaders,
                    },
                    body: JSON.stringify(body),
                });
                return fetch(url, request).then(this.options.responseHandler);
            }
        }
    }
    async delete(uri, query) {
        let url = '';
        if (this.options.urlHandler) {
            const baseUrl = this.options.baseUrl || '';
            url = this.options.urlHandler(baseUrl, uri, query);
            const ctx = { baseUrl: url };
            if (this.options.requestHandler) {
                const request = await this.options.requestHandler(ctx, {
                    method: 'DELETE',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        ...HttpClient.defaultHeaders,
                    },
                });
                return fetch(url, request).then(this.options.responseHandler);
            }
        }
    }
    static instance(config) {
        if (!this._instance) {
            this._instance = new HttpClient(config);
        }
        return this._instance;
    }
    static create(config) {
        return new HttpClient(config);
    }
}
