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

function invitation() {
  return {
    create: this.createRequest.call(this, {
      method: 'POST',
      path: '/invitation'
    }),
    get: this.createRequest.call(this, {
      method: 'GET',
      path: '/invitation'
    }),
    remove: this.createRequest.call(this, {
      method: 'DELETE',
      path: '/invitation'
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

export default function Authentis(userConfig) {
  this.config = {
    host: userConfig.host || 'https://auth.gozel.com.tr',
    version: userConfig.version || null,
    projectIdentifier: userConfig.projectIdentifier || '',
    projectLocale: userConfig.locale || '',
    token: userConfig.token || null,
    clientId: userConfig.clientId || null,
    clientSecret: userConfig.clientSecret || null
  }

  this.setLastResponse = function(resp) {
    this.lastResponse = resp
  }
  this.getLastResponse = function() {
    return this.lastResponse
  }

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
  }

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
  }

  return {
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
