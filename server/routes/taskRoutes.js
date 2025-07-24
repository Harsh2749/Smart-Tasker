import express from "express";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask
} from "../controllers/taskController.js";

import auth from "../middleware/auth.js";  

const router = express.Router();

router.get("/",    auth, getTasks);
router.post("/",   auth, createTask);
router.delete("/:id", auth, deleteTask);
router.put("/:id",   auth, updateTask);

export default router;
