// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const User = require("../models/user.model");

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL.callbackURL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const user = await User.findOne({ googleId: profile.id });

//         if (user) {
//           return done(null, user);
//         }

//         const newUser = new User({
//           username: profile.displayName,
//           googleId: profile.id,
//         });

//         await newUser.save();
//         return done(null, newUser);
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

// module.exports = passport;
