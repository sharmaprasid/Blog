const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");
const dotenv = require("dotenv");
const jwtUtils = require("./jwt");
const emailUtils = require("./emailVerification");
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id);
});
const googleClientId = process.env.GOOGLE_CLIENT_ID;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ googleId: profile.id });
        // console.log(user);
        if (user) {
          return done(null, user);
        }
        console.log(profile);
        const newUser = new User({
          username: profile.displayName,
          googleId: profile.id,
          email: profile.emails[0].value,
          verified: profile.emails.verified,
        });
        console.log(newUser);
        await newUser.save();
        const verificationToken = jwtUtils.generateVerificationToken(newUser);
        const verificationLink = `http://localhost:3000/api/auth/user/verify/${verificationToken}`;
        await emailUtils.sendVerificationEmail(newUser, verificationLink);
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
