const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  console.log(user);
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    }
  );
}

function generateVerificationToken(user) {
  console.log(user);
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.VERIFICATION_TOKEN_EXPIRATION,
    }
  );
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
};
