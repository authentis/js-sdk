import authentis from '../client'

export function createRequest(params) {
  const self = this
  const mayHaveBody = ['POST', 'PUT'].indexOf(params.method) !== -1
  const requestOpts = {
    method: params.method,
    credentials: 'same-origin',
    mode: 'cors',
    headers: self.createHeaders.call(self, params)
  }

  return async function req(opts={}) {
    const url = new URL(params.path, self.config.host)

    if (opts.path && Array.isArray(opts.path)) {
      url.pathname += '/' + opts.path.join('/')
    }

    if (opts.searchParams) {
      Object.keys(opts.searchParams).map(param => url.searchParams.set(param, opts.searchParams[param]))
    }

    if (opts.id) {
      if (/[^a-zA-Z0-9-]+/.test(opts.id)) {
        return {error: {code: 'REQUEST_ERROR', details: 'Invalid identifier.'}}
      }
      url.pathname = params.path + '/' + opts.id
    }

    if (opts.body) {
      if (Object.prototype.toString.call(opts.body) === '[object Object]') {
        requestOpts.body = JSON.stringify(opts.body)
      }
      else {
        requestOpts.body = opts.body
      }
    }

    try {
      const resp = await fetch(url, requestOpts)

      self.setLastResponse.call(self, resp)

      const obj = await resp.json()

      return obj
    } catch (e) {
      return {error: {code: 'REQUEST_ERROR'}}
    }
  }
}

export function configure(userConfig={}) {
  return authentis.call({createRequest}, userConfig)
}
