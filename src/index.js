import { _uuid, _randomInt, _sendAPI } from './utils'

class MithVaultSDK {
  constructor({ clientId, clientSecret, miningKey } = {}) {
    this.host = 'https://2019-hackathon.mithvault.io'
    this.api = 'https://2019-hackathon.api.mithvault.io'
    this.authorize = '/#/oauth/authorize'
    this.donate = '/#/donate'
    this.clientId = clientId
    this.clientSecert = clientSecret
    this.miningKey = miningKey
  }

  getBindURI(state = _uuid()) {
    const payload = {
      client_id: this.clientId,
      state: state
    }
    const query = Object.keys(payload)
      .map(key => `${key}=${payload[key]}`)
      .join('&')
    const url = `${this.host}${this.authorize}?${query}`
    return url
  }

  getDonateURI({ appID, userID, amount, state, description } = {}) {
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

    return `${this.host}${this.donate}?${query}`
  }

  getAccessToken({ grantCode, state } = {}) {
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

  delUnbindToken({ token } = {}) {
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

  getUserMiningAction({ token, nextId = null } = {}) {
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

  postUserMiningAction({
    token,
    uuid = _uuid(),
    reward = 1,
    happenedAt = null
  } = {}) {
    const now = new Date()
    const dtp = number => number.toString().padStart(2, 0)
    const payload = {
      client_id: this.clientId,
      timestamp: Math.floor(Date.now() / 1000),
      nonce: _randomInt(),
      mining_key: this.miningKey,
      uuid: uuid,
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

  deleteUserMiningAction({ token, uuid } = {}) {
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
