const axios = require('axios');
const jwt = require('jsonwebtoken');
const config = require('../config');

class Dukaan{
  constructor({
    API, 
    NAMESPACE, 
    SECRET
  }) {
    this._API = API
    this._NAMESPACE = NAMESPACE
    this._SECRET = SECRET
  }

  uriForRequest = url => [this._API, this._NAMESPACE, url].join('/')

  jwtForPayload = (payload = {}) =>
    jwt.sign({
      data: {
        clientName: 'oneauth',
        ...payload
      }
    }, this._SECRET , { algorithm: 'HS256' })

  addCreditsToWallet({oneauthId, amount, comment = 'Added Via OneAuth'}) {
    const jwt = this.jwtForPayload({
      amount,
      comment,
      oneauth_id: oneauthId
    })

    return axios.post({
      uri: this.urlForEndpoint('/users/wallet/credit'),
      headers: {
        'dukaan-token': jwt
      }
    })
  }
}

module.exports = new Dukaan(
  config.SECRETS.DUKAAN.ENDPOINT,
  config.SECRETS.DUKAAN.NAMESPACE,
  config.SECRETS.DUKAAN.SECRET
);

