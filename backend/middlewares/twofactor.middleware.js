const twofactorUtils = require("../utils/twofactorUtils");

function authenticateTwoFactor(req, res, next) {
  const { token } = req.body;
  const secret = process.env.twofactorSecret;

  if (!token || !twofactorUtils.verifyTwoFactorToken(secret, token)) {
    return res
      .status(401)
      .json({ message: "Invalid or missing two-factor authentication token" });
  }

  next();
}

module.exports = { authenticateTwoFactor };
