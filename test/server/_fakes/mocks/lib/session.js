const { Encoding } = require('ch-node-session-handler/lib/encoding/Encoding');

module.exports.responseMock = {
  cookie: () => {
    return true;
  },
  locals: {}
};

module.exports.requestMockWithSessionCookie = {
  cookies: {
    AD_SID: 'abc123'
  }
};

module.exports.requestMockWithoutSessionCookie = {
  cookies: {}
};

module.exports.sessionStoreLoadResolves = {
  run: () => {
    return Promise.resolve({
      extract: () => {
        return { one: 'two' };
      }
    });
  }
};

module.exports.sessionStoreLoadResolvesRead = {
  load: () => {
    return {
      run: () => {
        return Promise.resolve({
          extract: () => {
            return { one: 'two' };
          }
        });
      }
    };
  }
};

module.exports.sessionStoreLoadRejects = {
  run: () => {
    return Promise.reject(new Error());
  }
};

module.exports.sessionStoreWriteResolves = {
  run: () => {
    return Promise.resolve(true);
  }
};

module.exports.sessionStoreWriteRejects = {
  load: () => {
    return {
      run: () => {
        return Promise.reject(new Error());
      }
    };
  }
};

const SIGNED_IN_ID = '4ZhJ6pAmB5NAJbjy/6fU1DWMqqrk';
const SIGNED_IN_SIGNATURE = 'Ak4CCqkfPTY7VN6f9Lo5jHCUYpM';
module.exports.SIGNED_IN_COOKIE = SIGNED_IN_ID + SIGNED_IN_SIGNATURE;

module.exports.sessionSignedIn = Encoding.encode({
  '.client.signature': SIGNED_IN_SIGNATURE,
  '.id': SIGNED_IN_ID,
  expires: Date.now() + 3600 * 1000,
  signin_info: {
    access_token: {
      access_token: 'oKi1z8KY0gXsXu__hy2-YU_JJSdtxOkJ4K5MAE-gOFVzpKt5lvqnFpVeUjhqhVHZ1K8Hkr7M4IYdzJUnOz2hQw',
      expires_in: 3600,
      refresh_token: 'y4YXof84bkUeBZlavRlAGfdq5VMkpPm6UR0OYwPvI6i6UDmtEiTQ1Ro-HGCGo01y4ploP4Kdwd6H4dEh8-E_Fg',
      token_type: 'Bearer'
    },
    signed_in: 1
  }
});
