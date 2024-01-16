const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

function generateTwoFactorSecret() {
  return speakeasy.generateSecret({ length: 20 }).base32;
}

function generateTwoFactorToken(secret) {
  return speakeasy.totp({
    secret,
    encoding: "base32",
  });
}

function verifyTwoFactorToken(secret, token) {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
  });
}
async function generateQRCode(secret, label, issuer) {
  const otpauthUrl = `otpauth://totp/${issuer}:${label}?secret=${secret}&issuer=${issuer}`;
  const qrCodeImage = await qrcode.toDataURL(otpauthUrl);
  return qrCodeImage;
}

module.exports = {
  generateTwoFactorSecret,
  generateTwoFactorToken,
  generateQRCode,
  verifyTwoFactorToken,
};
