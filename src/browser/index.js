import authentis from '../client'

export function createRequest(params) {
  const self = this
  const mayHaveBody = ['POST', 'PUT'].indexOf(params.method) !== -1
  const requestOpts = {
    method: params.method,
    credentials: 'same-origin',
    mode: 'cors'
  }

  const contentTypeHeader = mayHaveBody ? {'Content-Type': 'application/json'} : {}
  const authHeader = self.config.token ? {'Authorization': 'Bearer ' + self.config.token} : {}
  const initialHeaders = Object.assign({}, {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }, contentTypeHeader, authHeader)
  const headers = Object.assign({}, initialHeaders, params.headers || {})
  requestOpts.headers = headers

  return async function req(arg1=null, arg2=null) {
    const pathSuffix = !mayHaveBody && arg1 ? '/' + arg1 : mayHaveBody && arg2 ? '/' + arg1 : ''
    const fullpath = self.config.host + params.path + pathSuffix
    const payload = arg2 ? arg2 : arg1 && mayHaveBody ? arg1 : null

    if (mayHaveBody && payload) {
      requestOpts.body = JSON.stringify(payload)
    }

    try {
      const resp = await fetch(fullpath, requestOpts)

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
