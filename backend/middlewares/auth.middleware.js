const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function authenticateVerificationToken(req, res, next) {
  const verificationToken = req.params.verificationToken;
  if (!verificationToken) return res.sendStatus(400);

  jwt.verify(verificationToken, config.secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken, authenticateVerificationToken };
