# js-sdk
Authentis javascript client. Runs on browser and node.js

## Requirements
1. An Authentis account.
2. Browser or Node.js

## Installation
```sh
npm i @authentis/js-sdk
```

## Usage
Create a configuration object:
```js
const config = {
  host: 'http://url.com',
  projectIdentifier: '',
  // either provide token
  token: '',
  // or clientId and clientSecret
  clientId: '',
  clientSecret: ''
}
```

### Configure for node.js
```js
const sdk = require('@authentis/js-sdk/node/cjs')
const client = sdk.configure(config)
```
ES module export also available:
```js
const sdk = require('@authentis/js-sdk/node/es')
const client = sdk.configure(config)
```

### Configure for Browsers
```js
const sdk = require('@authentis/js-sdk/browser/cjs')
const client = sdk.configure(config)
```
ES module export also available for browser apps:
```js
const sdk = require('@authentis/js-sdk/browser/es')
const client = sdk.configure(config)
```
Or inject iife export via script tag:
```html
<script type="text/javascript" src="../dist/browser/iife/index.js"></script>
```
Then configure:
```js
// window.Authentis is available.
const client = Authentis.configure(config)
```

Now we can send API requests.

### API
Structure of API requests:
```js
client[domain][method](opts = {
  // Request body
  body: {}
  // Query string parameters
  searchParams: {}
  // path suffix. Array items will be added to url path: /some/path/identifier
  path: ['identifier']
});
```

#### 1. Captcha handshake and verify
```js
const nonce = 'some_random_identifier'

client.captcha.handshake({body: {nonce: nonce}}).then(function(data) {
  const {hash, difficulty} = data
  const proof = '' // generate proof based on hash and difficulty

  client.captcha.verify({body: {nonce: nonce, proof: proof}}).then(function(data) {
    const {success} = data
  })
})
```

TODO: complete docs.

---

Version management of this repository done by [releaser](https://github.com/muratgozel/node-releaser) 🚀
