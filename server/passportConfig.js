import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract the user’s email from their Google profile
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });

      // If user doesn’t exist yet, create them with a random password
      if (!user) {
        const randomPassword = await bcrypt.hash(profile.id, 10);
        user = await User.create({ email, password: randomPassword });
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));
