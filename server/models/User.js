import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ───── Fields for “Forgot Password” flow ─────
  resetPasswordToken:   { type: String },
  resetPasswordExpires: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);
