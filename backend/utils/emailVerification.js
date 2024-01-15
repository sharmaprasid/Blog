const nodemailer = require("nodemailer");

async function sendVerificationEmail(user, verificationLink) {
  console.log(verificationLink);
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "aut@test.com",
    to: user.email,
    subject: "Email Verification",
    text: `Click the following link to verify your email: ${verificationLink}`,
  };

  await transporter.sendMail(mailOptions);
}

async function sendResetPasswordEmail(user, resetLink) {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "aut@test.com",
    to: user.email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
