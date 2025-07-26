import React, { useState, useEffect } from "react";
import API from "../api";
import Header from "../components/Header";
import TaskCard from "../components/TaskCard";
import "./Dashboard.css";


export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  // “Add” form fields
  const [title, setTitle]         = useState("");
  const [description, setDescr]   = useState("");
  const [remindAt, setRemindAt]   = useState("");
  const [phone, setPhone]         = useState("");

  // **Edit‑mode** fields
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle]       = useState("");
  const [editDescr, setEditDescr]       = useState("");
  const [editRemindAt, setEditRemindAt] = useState("");
  const [editPhone, setEditPhone]       = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

async function fetchTasks() {
  try {
    const res = await API.get("/tasks");
    setTasks(res.data); 
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    // handle redirect if unauthorized
  }
}

  // ─── ADD ─────────────────────────────────────────────────────────
async function handleAdd(e) {
  e.preventDefault();
  if (!title.trim()) return;

  const utcTime = remindAt
    ? new Date(remindAt).toISOString()
    : null;
  const { data } = await API.post("/tasks", {
    title,
    description,
    remindAt: utcTime, 
    phone,
  });

  setTasks([data, ...tasks]);
  resetForm();
}




  // ─── DELETE ──────────────────────────────────────────────────────
  async function handleDelete(id) {
  await API.delete(`/tasks/${id}`);

    setTasks(tasks.filter((t) => t._id !== id));
  }

  // ─── START EDIT ─────────────────────────────────────────────────
  function startEdit(task) {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescr(task.description || "");
    setEditRemindAt(task.remindAt ? task.remindAt.substring(0, 16) : "");
    setEditPhone(task.phone || "");
  }

  // ─── CANCEL EDIT ────────────────────────────────────────────────
  function cancelEdit() {
    setEditingId(null);
    resetForm();
  }

  // ─── SAVE UPDATE ────────────────────────────────────────────────
async function handleUpdate(e) {
  e.preventDefault();

const utcTime = editRemindAt
  ? new Date(editRemindAt).toISOString()
  : null;

  const { data } = await API.put(`/tasks/${editingId}`, {
    title: editTitle,
    description: editDescr,
    remindAt: utcTime, 
    phone: editPhone,
  });

  setTasks(tasks.map((t) => (t._id === editingId ? data : t)));
  cancelEdit();
}



  // ─── RESET ALL FORM FIELDS ─────────────────────────────────────
  function resetForm() {
    setTitle("");
    setDescr("");
    setRemindAt("");
    setPhone("");
    setEditTitle("");
    setEditDescr("");
    setEditRemindAt("");
    setEditPhone("");
  }

  return (
    <div className="dashboard-wrapper">
      <header><Header /></header>
      <div className="dashboard-content">
        {/* ─── FORM SECTION ─────────────────────────────────────── */}
        <div className="form-section">
          <form
            className="task-form"
            onSubmit={editingId ? handleUpdate : handleAdd}
          >
            <h3>{editingId ? "Edit Task" : "Add New Task"}</h3>

            <input
              type="text"
              placeholder="Task title"
              value={editingId ? editTitle : title}
              onChange={(e) =>
                editingId
                  ? setEditTitle(e.target.value)
                  : setTitle(e.target.value)
              }
            />
            <textarea
              placeholder="Description (optional)"
              value={editingId ? editDescr : description}
              onChange={(e) =>
                editingId
                  ? setEditDescr(e.target.value)
                  : setDescr(e.target.value)
              }
            />
            <label>Remind me at (optional)</label>
            <input
              type="datetime-local"
              value={editingId ? editRemindAt : remindAt}
              onChange={(e) =>
                editingId
                  ? setEditRemindAt(e.target.value)
                  : setRemindAt(e.target.value)
              }
            />
            <input
              type="tel"
              placeholder="Phone for SMS (optional)"
              value={editingId ? editPhone : phone}
              onChange={(e) =>
                editingId
                  ? setEditPhone(e.target.value)
                  : setPhone(e.target.value)
              }
            />

            <div className="form-actions">
              <button type="submit" className="btn btn-primary-gradient w-100">
                {editingId ? "Save Changes" : "Add Task"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary w-100 mt-2"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ─── TASK LIST ─────────────────────────────────────────── */}
        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="no-tasks">
              No tasks yet—use the form on the left to add one.
            </p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                title={task.title}
                description={task.description}
                remindAt={task.remindAt}
                phone={task.phone}
                onDelete={() => handleDelete(task._id)}
                onEdit={() => startEdit(task)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
