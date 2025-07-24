import User   from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Prevent duplicate accounts
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Save user in database
    await User.create({ email, password: hash });
    res.status(201).json({ message: "Account created successfully." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Could not create account. Please try again." });
  }
};
