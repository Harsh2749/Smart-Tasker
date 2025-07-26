import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function ResetPassword() {
  const { token }             = useParams();
  const [password, setPass]   = useState("");
  const [message, setMsg]     = useState("");
  const [error, setError]     = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg(""); setError("");
    try {
      const res = await API.post(`/auth/reset-password/${token}`, { password });
      setMsg(res.data.message);
      // redirect to login after a brief pause
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3>Reset Password</h3>
      {message && <div className="alert alert-success">{message}</div>}
      {error   && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="form-control mb-2"
          placeholder="New password"
          value={password}
          required
          onChange={e => setPass(e.target.value)}
        />
        <button type="submit" className="btn btn-success w-100">
          Set New Password
        </button>
      </form>
    </div>
  );
}
