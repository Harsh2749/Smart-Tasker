import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, remindAt, phone } = req.body;
    const newTask = new Task({
      title,
      description,
      user: req.user.email,
      remindAt: remindAt ? new Date(remindAt) : null,
      phone,
      reminded: false
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.email }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, remindAt, phone } = req.body;
    const updated = await Task.findByIdAndUpdate(id, {
      title, description, remindAt: remindAt ? new Date(remindAt) : null, phone
    }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};
