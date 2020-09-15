const Utility = require(`${serverRoot}/lib/Utility`);

const authentication = (req, res, next) => {
  try {
    let authCheck = false;
    if (typeof req.session !== 'undefined') {
      if (typeof req.session.data.signin_info !== 'undefined') {
        if (req.session.data.signin_info.signed_in === 1) {
          authCheck = true;
        }
      }
    }
    if (!authCheck) {
      throw new Error('User not signed in');
    } else {
      next();
    }
  } catch (err) {
    Utility.logException(err);
    const port = req.socket.localPort && req.socket.localPort !== '80' ? ':' + req.socket.localPort : '';
    const returnUrl = `${req.protocol}://${req.hostname}${port}${req.originalUrl}`;
    return res.redirect(302, `${process.env.ACCOUNT_URL}/signin?return_to=${returnUrl}`);
  }
};

module.exports = authentication;
