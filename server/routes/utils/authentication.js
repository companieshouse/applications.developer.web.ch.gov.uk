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
    if (authCheck) {
      next();
    } else {
      return res.redirect(302, `${process.env.DEV_HUB_URL}/signin`);
    }
  } catch (err) {
    Utility.logException(err);
    next(err);
  }
};

module.exports = authentication;
