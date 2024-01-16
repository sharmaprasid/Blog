const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
function authenticateToken(req, res, next) {
  const token = req.cookies.Authorization;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;

    next();
  });
}

async function authenticateVerificationToken(req, res, next) {
  const verificationToken = req.params.verificationToken;

  if (!verificationToken) return res.sendStatus(400);

  jwt.verify(
    verificationToken,
    process.env.SECRET_KEY,
    async (err, decodedUser) => {
      if (err) return res.sendStatus(403);

      const user = await User.findById(decodedUser.id);

      if (!user) return res.sendStatus(401);

      req.user = user;
      next();
    }
  );
}

module.exports = { authenticateToken, authenticateVerificationToken };
