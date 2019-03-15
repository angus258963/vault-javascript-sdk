# VAULT SDK for JavaScript

This open-source library allows you to integrate VAULT into your app.
Learn more about about the provided samples, documentation, integrating the SDK into your app, and more at [deck slide](https://drive.google.com/file/d/1g4-O4WggqCec6fTVqP2-4hDq6DFgUFbB/view)

## FEATURE

- [login](https://documenter.getpostman.com/view/4856913/RztrHRU9#3563f4ea-88bc-403d-8071-d3d3767bd01d)
- [mining](https://documenter.getpostman.com/view/4856913/RztrHRU9#0cbb0a41-2cfc-4d3a-b541-4cfbbf807843)
- [donate](https://documenter.getpostman.com/view/4856913/RztrHRU9#608ccdd4-6a95-41f0-b247-ffae9a976feb)

## INSTALLATION

In a browser:

```html
// Add dependency packages
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js"></script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>

// Mithril VAULT SDK
<script src="mith-vault-sdk.min.js"></script>
```

In Node.js

- Install dependency packages [axio](https://github.com/axios/axios) and [crypto-js](https://github.com/brix/crypto-js)

- Import MithVaultSDK into your project

```js
const MithVaultSDK = require('mith-vault-sdk.min.js')
```

## USAGE

With your application CLIENT ID, CLIENT KEY and MINING KEY, create a MithVaultSDK instance and your application can execute VAULT API. For example

```js
const clientId = 'ba6cabfb4de8d9f4f388124b1afe82b1'
const clientSecret = 'aefd2b59d780eb29bc95b6cf8f3503233ad702141b20f53c8a645afbb8c6616048c5e9cc741e0ebee1a2469c68364e57e29dbeeabadc0b67958b9c3da7eabab9'
const miningKey = 'demo'
const userToken = '1668ff50dca1a85086b558e9e5abc521f14f2317712cb7725d8a9b0f670afe04ea61e091f1060e7845e16e55e300995cb79340782ce34ba683ec9e37e856ff95'

const sdk = new MithVaultSDK({ clientID, clientSecret, miningKey })
sdk.getUserMiningAction({ token: userToken }).then(data => {
  ...
}).catch(error => {
  ...
})
```

## GIVE FEEDBACK

Please report bugs or issues to [hackathon@mith.io](hackathon@mith.io)
