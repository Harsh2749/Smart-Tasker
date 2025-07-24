import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  user: { type: String, required: true },
  remindAt: { type: Date, default: null },   
  reminded: { type: Boolean, default: false },
  phone: { type: String }
}, {
  timestamps: true,
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
