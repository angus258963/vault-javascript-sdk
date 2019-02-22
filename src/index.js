import CryptoJS from 'crypto-js'
import axios from 'axios'

class MithVaultSDK {
  constructor(clientId, clientSecert, miningKey) {
    this.host = 'https://2019-hackathon.mithvault.io'
    this.api = 'https://2019-hackathon.api.mithvault.io'
    this.authorize = '/#/oauth/authorize'
    this.donate = '/#/donate'
    this.clientId = clientId
    this.clientSecert = clientSecert
    this.miningKey = miningKey
  }

  getBindURI(state = null) {
    const payload = {
      client_id: this.clientId,
      state: state || _uuid()
    }
    const query = Object.keys(payload)
      .map(key => `${key}=${payload[key]}`)
      .join('&')
    const url = `${this.host}${this.authorize}?${query}`
    return url
  }

  getDonateURI(appID, userID, amount, state, description) {
    const payload = {
      app_id: appID,
      user_id: userID,
      amount,
      state,
      desc: description
    }
    const query = Object.keys(payload)
      .map(key => `${key}=${payload[key]}`)
      .join('&')
    const url = `${this.host}${this.donate}?${query}`
    return url
  }

  getAccessToken(grantCode, state) {
    const payload = {
      client_id: this.clientId,
      timestamp: Math.floor(Date.now() / 1000),
      nonce: _randomInt(),
      grant_code: grantCode,
      state
    }
    const response = _sendAPI.call(this, 'oauth/token', 'POST', {
      data: payload
    })
    return response
  }

  delUnbindToken(token) {
    const payload = {
      client_id: this.clientId,
      timestamp: Math.floor(Date.now() / 1000),
      nonce: _randomInt()
    }
    const headers = { Authorization: token }

    const response = _sendAPI.call(this, 'oauth/token', 'DELETE', {
      headers,
      params: payload
    })

    return response
  }

  getClientInformation() {
    const payload = {
      client_id: this.clientId,
      timestamp: Math.floor(Date.now() / 1000),
      nonce: _randomInt()
    }

    const response = _sendAPI.call(this, 'oauth/balance', 'GET', {
      params: payload
    })
    return response
  }

  getUserInformation(token) {
    const payload = {
      client_id: this.clientId,
      timestamp: Math.floor(Date.now() / 1000),
      nonce: _randomInt()
    }

    const headers = { Authorization: token }
    const response = _sendAPI.call(this, 'oauth/user-info', 'GET', {
      headers,
      params: payload
    })

    return response
  }

  getUserMiningAction(token, nextId = null) {
    const payload = {
      client_id: this.clientId,
      timestamp: Math.floor(Date.now() / 1000),
      nonce: _randomInt(),
      mining_key: this.miningKey
    }

    const headers = {
      Authorization: token
    }

    if (nextId) {
      payload['next_id'] = nextId
    }

    const response = _sendAPI.call(this, 'mining', 'GET', {
      headers,
      params: payload
    })
    return response
  }

  postUserMiningAction(token, uuid = null, reward = 1, happenedAt = null) {
    const now = new Date()
    const dtp = number => number.toString().padStart(2, 0)
    const payload = {
      client_id: this.clientId,
      timestamp: Math.floor(Date.now() / 1000),
      nonce: _randomInt(),
      mining_key: this.miningKey,
      uuid: uuid || _uuid(),
      reward,
      happened_at:
        happenedAt ||
        `${now.getUTCFullYear()}-${dtp(now.getUTCMonth())}-${dtp(
          now.getUTCDate()
        )}T${dtp(now.getUTCHours())}:${dtp(now.getUTCMinutes())}:${dtp(
          now.getUTCSeconds()
        )}`
    }
    const headers = {
      Authorization: token
    }

    const response = _sendAPI.call(this, 'mining', 'POST', {
      headers,
      data: payload
    })

    return response
  }

  deleteUserMiningAction(token, uuid) {
    const payload = {
      client_id: this.clientId,
      timestamp: Math.floor(Date.now() / 1000),
      nonce: _randomInt(),
      mining_key: this.miningKey,
      uuid: uuid || _uuid()
    }
    const headers = {
      Authorization: token
    }

    const response = _sendAPI.call(this, 'mining', 'DELETE', {
      headers,
      params: payload
    })

    return response
  }
}

export default MithVaultSDK

function _uuid() {
  var d = Date.now()
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now() //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function _sendAPI(
  endpoint,
  method = 'GET',
  options = { headers: null, data: null, params: null }
) {
  const payload = options.params || options.data || {}
  const headers = options.headers || {}

  if ('client_id' in payload) {
    const signature = _generateSignature(
      payload,
      CryptoJS.enc.Hex.parse(this.clientSecert)
    )
    headers['X-Vault-Signature'] = signature
  }

  const url = `${this.api}/${endpoint}`
  try {
    return axios({
      method,
      url,
      params: options.params,
      data: options.data,
      headers
    })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  } catch (e) {
    throw e
  }
}

function _generateSignature(data, secret) {
  let query = ''
  if (data && Array.isArray(data)) {
    query = data.join(',')
  } else if (data) {
    const sortedData = _sortObject(data)
    query = Object.keys(sortedData)
      .map(key => `${key}=${sortedData[key]}`)
      .join('&')
  } else if (data) {
    query = data.toString()
  }
  const signature = CryptoJS.HmacSHA512(query, secret)
  return CryptoJS.enc.Hex.stringify(signature)
}

function _sortObject(o) {
  return Object.keys(o)
    .sort()
    .reduce((r, k) => ((r[k] = o[k]), r), {})
}

function _randomInt() {
  return Math.floor(Math.random() * 1e17)
}
