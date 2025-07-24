import React from "react";

export default function TaskCard({
  title,
  description,
  remindAt,
  phone,
  onDelete,
  onEdit
}) {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>

        {description && <p className="card-text">{description}</p>}

        {remindAt && (
          <p className="card-text">
            <small className="text-muted">
              Reminder:{" "}
              {new Date(remindAt).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                day:   "numeric",
                month: "numeric",
                year:  "numeric",
                hour:   "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
              })}
            </small>
          </p>
        )}

        {phone && (
          <p className="card-text">
            <small className="text-muted">Phone: {phone}</small>
          </p>
        )}

        <button
          className="btn btn-secondary btn-sm me-2"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
