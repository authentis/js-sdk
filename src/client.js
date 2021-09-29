function captcha() {
  return {
    handshake: this.createRequest.call(this, {
      method: 'PUT',
      path: '/captcha'
    }),
    check: this.createRequest.call(this, {
      method: 'POST',
      path: '/captcha'
    })
  }
}

function signin() {
  return {
    request: this.createRequest.call(this, {
      method: 'POST',
      path: '/signin'
    }),
    verify: this.createRequest.call(this, {
      method: 'PUT',
      path: '/signin'
    }),
    state: this.createRequest.call(this, {
      method: 'GET',
      path: '/signin'
    }),
    revoke: this.createRequest.call(this, {
      method: 'DELETE',
      path: '/signin'
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
    })
  }
}

function messageTemplate() {
  return {
    create: this.createRequest.call(this, {
      method: 'POST',
      path: '/message-template'
    }),
    update: this.createRequest.call(this, {
      method: 'PUT',
      path: '/message-template'
    }),
    get: this.createRequest.call(this, {
      method: 'GET',
      path: '/message-template'
    }),
    remove: this.createRequest.call(this, {
      method: 'DELETE',
      path: '/message-template'
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

export default function Authentis(userConfig) {
  this.config = {
    host: userConfig.host || 'https://auth.gozel.com.tr',
    token: userConfig.token || null,
    version: userConfig.version || null
  }
  this.setLastResponse = function(resp) {
    this.lastResponse = resp
  }
  this.getLastResponse = function() {
    return this.lastResponse
  }

  return {
    getLastResponse: this.getLastResponse.bind(this),
    captcha: captcha.apply(this),
    signin: signin.apply(this),
    organization: organization.apply(this),
    project: organization.apply(this),
    messageTemplate: messageTemplate.apply(this),
    invitation: invitation.apply(this)
  }
}
