import express  from "express";
import bcrypt   from "bcryptjs";
import jwt      from "jsonwebtoken";
import crypto   from "crypto";
import User     from "../models/User.js";
import { sendEmail } from "../utils/reminders.js";

const router     = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered." });
    }
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed });
    return res.status(201).json({ message: "Account created successfully." });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Could not create account." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password." });

    const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: "2h" });
    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed." });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account with that email." });

    // generate token & expiry (1 hour)
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken   = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // send reset link
    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    await sendEmail({
      user: user.email,
      title: "Password Reset Request",
      description: `Click here to reset your password: ${resetUrl}`
    });

    return res.json({ message: "Password reset email sent." });
  } catch (err) {
    console.error("Forgot-password error:", err);
    return res.status(500).json({ message: "Error sending reset email." });
  }
});

// POST /api/auth/reset-password/:token
router.post("/reset-password/:token", async (req, res) => {
  const { token }    = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken:   token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: "Token is invalid or has expired." });
    }

    // hash new password & clear reset fields
    user.password              = await bcrypt.hash(password, 10);
    user.resetPasswordToken    = undefined;
    user.resetPasswordExpires  = undefined;
    await user.save();

    return res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Reset-password error:", err);
    return res.status(500).json({ message: "Error resetting password." });
  }
});


import passport from "passport"; 

// ─── Google OAuth endpoints ────────────────────────────────────────

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`
  }),
  (req, res) => {
    // Issue JWT for React client
    const token = jwt.sign(
      { email: req.user.email, id: req.user._id },
      JWT_SECRET,
      { expiresIn: "2h" }
    );
    // Redirect back to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/oauth2/redirect?token=${token}`
    );
  }
);


export default router;
