import http from 'https';

function captcha() {
  return {
    handshake: this.createRequest.call(this, {
      method: 'PUT',
      path: '/captcha'
    }),
    verify: this.createRequest.call(this, {
      method: 'POST',
      path: '/captcha'
    })
  }
}

function auth() {
  return {
    state: this.createRequest.call(this, {
      method: 'GET',
      path: '/auth/state'
    }),
    session: this.createRequest.call(this, {
      method: 'POST',
      path: '/auth/session'
    }),
    epwd: this.createRequest.call(this, {
      method: 'POST',
      path: '/auth/signin/epwd'
    }),
    epwdv: this.createRequest.call(this, {
      method: 'PUT',
      path: '/auth/signin/epwd'
    }),
    eotp: this.createRequest.call(this, {
      method: 'POST',
      path: '/auth/signin/eotp'
    }),
    eotpv: this.createRequest.call(this, {
      method: 'PUT',
      path: '/auth/signin/eotp'
    }),
    potp: this.createRequest.call(this, {
      method: 'POST',
      path: '/auth/signin/potp'
    }),
    potpv: this.createRequest.call(this, {
      method: 'PUT',
      path: '/auth/signin/potp'
    }),
    revoke: this.createRequest.call(this, {
      method: 'DELETE',
      path: '/auth/revoke'
    })
  }
}

function organization() {
  return {
    create: this.createRequest.call(this, {
      method: 'POST',
      path: '/org'
    }),
    update: this.createRequest.call(this, {
      method: 'PUT',
      path: '/org'
    }),
    get: this.createRequest.call(this, {
      method: 'GET',
      path: '/org'
    }),
    remove: this.createRequest.call(this, {
      method: 'DELETE',
      path: '/org'
    })
  }
}

function project() {
  return {
    create: this.createRequest.call(this, {
      method: 'POST',
      path: '/project'
    }),
    update: this.createRequest.call(this, {
      method: 'PUT',
      path: '/project'
    }),
    get: this.createRequest.call(this, {
      method: 'GET',
      path: '/project'
    }),
    remove: this.createRequest.call(this, {
      method: 'DELETE',
      path: '/project'
    }),
    signinMethod: {
      create: this.createRequest.call(this, {
        method: 'POST',
        path: '/project/signin-method'
      }),
      update: this.createRequest.call(this, {
        method: 'PUT',
        path: '/project/signin-method'
      }),
      get: this.createRequest.call(this, {
        method: 'GET',
        path: '/project/signin-method'
      }),
      remove: this.createRequest.call(this, {
        method: 'DELETE',
        path: '/project/signin-method'
      })
    }
  }
}

function app() {
  return {
    create: this.createRequest.call(this, {
      method: 'POST',
      path: '/app'
    }),
    update: this.createRequest.call(this, {
      method: 'PUT',
      path: '/app'
    }),
    get: this.createRequest.call(this, {
      method: 'GET',
      path: '/app'
    }),
    remove: this.createRequest.call(this, {
      method: 'DELETE',
      path: '/app'
    })
  }
}

function device() {
  return {
    inspect: this.createRequest.call(this, {
      method: 'PUT',
      path: '/device'
    })
  }
}

function subject() {
  return {
    signinMethod: this.createRequest.call(this, {
      method: 'GET',
      path: '/subject/signin-method'
    })
  }
}

function configure$1() {
  return function(userConfig) {
    this.config = Object.assign({}, this.config, userConfig);
  }.bind(this)
}

function getConfig() {
  return function() {
    return this.config
  }.bind(this)
}

function Authentis(userConfig) {
  this.config = {
    host: userConfig.host,
    version: userConfig.version || null,
    projectIdentifier: userConfig.projectIdentifier || '',
    projectLocale: userConfig.locale || '',
    token: userConfig.token || null,
    clientId: userConfig.clientId || null,
    clientSecret: userConfig.clientSecret || null
  };

  if (!this.config.host) {
    throw new Error('Missing option "host".')
  }

  this.setLastResponse = function(resp) {
    this.lastResponse = resp;
  };
  this.getLastResponse = function() {
    return this.lastResponse
  };

  this.createAuthHeader = function createAuthHeader(obj) {
    if (obj.token) {
      return 'Bearer ' + obj.token
    }
    else if (obj.clientId && obj.clientSecret) {
      return 'Basic ' + btoa(obj.clientId + ':' + obj.clientSecret)
    }
    else {
      return ''
    }
  };

  this.createHeaders = function createHeaders(obj) {
    return Object.assign({},
      {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      ['POST', 'PUT'].indexOf(obj.method) !== -1
        ? {'Content-Type': 'application/json'}
        : {},
      {'Authorization': this.createAuthHeader(this.config)},
      this.config.projectIdentifier
        ? {'Authentis-Project-Identifier': this.config.projectIdentifier}
        : {},
      this.config.projectLocale
        ? {'Authentis-Project-Locale': this.config.projectLocale}
        : {}
    )
  };

  return {
    configure: configure$1.apply(this),
    getConfig: getConfig.apply(this),
    getLastResponse: this.getLastResponse.bind(this),
    captcha: captcha.apply(this),
    auth: auth.apply(this),
    organization: organization.apply(this),
    project: project.apply(this),
    app: app.apply(this),
    device: device.apply(this),
    subject: subject.apply(this)
  }
}

/*
function getUserAgent() {
  return 'Authentis/SDK/' + pkg.version + ' Node.js/' + process.versions.node
}
*/
function createRequest(params) {
  const self = this;
  ['POST', 'PUT'].indexOf(params.method) !== -1;
  const requestOpts = {
    method: params.method,
    headers: self.createHeaders.call(self, params)
  };

  return async function req(opts={}) {
    return new Promise(function(resolve, reject) {
      let body = null;
      const url = new URL(params.path, self.config.host);

      if (opts.path && Array.isArray(opts.path)) {
        url.pathname += '/' + opts.path.join('/');
      }

      if (opts.searchParams) {
        Object.keys(opts.searchParams).map(param => url.searchParams.set(param, opts.searchParams[param]));
      }

      if (opts.id) {
        if (/[^a-zA-Z0-9-]+/.test(opts.id)) {
          return {error: {code: 'REQUEST_ERROR', details: 'Invalid identifier.'}}
        }
        url.pathname = params.path + '/' + opts.id;
      }

      if (opts.body) {
        if (Object.prototype.toString.call(opts.body) === '[object Object]') {
          body = JSON.stringify(opts.body);
        }
        else {
          body = opts.body;
        }

        requestOpts.headers['Content-Length'] = Buffer.byteLength(body, 'utf8');
      }

      const request = http.request(url, requestOpts);

      request.on('socket', function(socket) {
        socket.setTimeout(5000);
        socket.on('timeout', function() {
          request.abort();
        });
      });

      request.on('abort', function(e) {
        return resolve({error: {code: 'REQUEST_ABORTED'}})
      });

      request.on('error', function(e) {
        return resolve({error: {code: 'REQUEST_ERROR', details: e}})
      });

      request.on('response', function(response) {
        let data=[], size=0;

        response.on('data', function(chunk) {
          data.push(chunk);
          size += chunk.length;
        });

        response.on('close', function() {
          return resolve({error: {code: 'REQUEST_ERROR', details: e}})
        });

        response.on('end', function() {
          data = Buffer.concat(data, size).toString().trim();

          self.setLastResponse.call(self, response);

          try {
            data = JSON.parse(data);

            return data
          } catch (e) {
            return {error: {code: 'REQUEST_ERROR', details: e}}
          }
        });
      });

      request.end(body);
    })
  }
}

function configure(userConfig={}) {
  return Authentis.call({createRequest}, userConfig)
}

export { configure };
//# sourceMappingURL=index.js.map
