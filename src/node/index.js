import http from 'https'
import authentis from '../client'
import pkg from '../../package.json'

function getUserAgent() {
  return 'Authentis/SDK/' + pkg.version + ' Node.js/' + process.versions.node
}

function createRequest(params) {
  const self = this
  const mayHaveBody = ['POST', 'PUT'].indexOf(params.method) !== -1
  const requestOpts = {
    method: params.method,
    hostname: self.config.host
  }

  const contentTypeHeader = mayHaveBody ? {'Content-Type': 'application/json'} : {}
  const authHeader = self.config.token ? {'Authorization': 'Bearer ' + self.config.token} : {}
  const initialHeaders = Object.assign({}, {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'User-Agent': getUserAgent()
  }, contentTypeHeader, authHeader)
  const headers = Object.assign({}, initialHeaders, params.headers || {})
  requestOpts.headers = headers

  return async function req(arg1, arg2) {
    return new Promise(function(resolve, reject) {
      const pathSuffix = !mayHaveBody && arg1 ? '/' + arg1 : mayHaveBody && arg2 ? '/' + arg1 : ''
      const payload = arg2 ? arg2 : arg1 && mayHaveBody ? arg1 : null
      const body = payload ? JSON.stringify(payload) : null

      requestOpts.path = params.path + pathSuffix

      if (mayHaveBody && payload) {
        requestOpts.headers['Content-Length'] = Buffer.byteLength(body, 'utf8')
      }

      const request = http.request(requestOpts)

      request.on('socket', function(socket) {
        socket.setTimeout(5000)
        socket.on('timeout', function() {
          request.abort()
        })
      })

      request.on('error', function(e) {
        return resolve({error: {code: 'REQUEST_ERROR'}})
      })

      request.on('response', function(response) {
        let data=[], size=0

        response.on('data', function(chunk) {
          data.push(chunk)
          size += chunk.length
        })

        response.on('close', function() {
          return resolve({error: {code: 'REQUEST_ERROR'}})
        })

        response.on('end', function() {
          data = Buffer.concat(data, size).toString().trim()

          self.setLastResponse.call(self, response)

          try {
            data = JSON.parse(data)

            return data
          } catch (e) {
            return {error: {code: 'REQUEST_ERROR'}}
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
