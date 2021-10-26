import http from 'https'
import authentis from '../client'

/*
function getUserAgent() {
  return 'Authentis/SDK/' + pkg.version + ' Node.js/' + process.versions.node
}
*/
function createRequest(params) {
  const self = this
  const mayHaveBody = ['POST', 'PUT'].indexOf(params.method) !== -1
  const requestOpts = {
    method: params.method,
    headers: self.createHeaders.call(self, params)
  }

  return async function req(opts={}) {
    return new Promise(function(resolve, reject) {
      let body = null
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
          body = JSON.stringify(opts.body)
        }
        else {
          body = opts.body
        }

        requestOpts.headers['Content-Length'] = Buffer.byteLength(body, 'utf8')
      }

      const request = http.request(url, requestOpts)

      request.on('socket', function(socket) {
        socket.setTimeout(5000)
        socket.on('timeout', function() {
          request.abort()
        })
      })

      request.on('abort', function(e) {
        return resolve({error: {code: 'REQUEST_ABORTED'}})
      })

      request.on('error', function(e) {
        return resolve({error: {code: 'REQUEST_ERROR', details: e}})
      })

      request.on('response', function(response) {
        let data=[], size=0

        response.on('data', function(chunk) {
          data.push(chunk)
          size += chunk.length
        })

        response.on('close', function() {
          return resolve({error: {code: 'REQUEST_ERROR', details: e}})
        })

        response.on('end', function() {
          data = Buffer.concat(data, size).toString().trim()

          self.setLastResponse.call(self, response)

          try {
            data = JSON.parse(data)

            return data
          } catch (e) {
            return {error: {code: 'REQUEST_ERROR', details: e}}
          }
        })
      })

      request.end(body)
    })
  }
}

export function configure(userConfig={}) {
  return authentis.call({createRequest}, userConfig)
}
