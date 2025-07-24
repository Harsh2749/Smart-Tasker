import React, { useState } from "react";
import API from "../api";

export default function ForgotPassword() {
  const [email, setEmail]   = useState("");
  const [message, setMsg]   = useState("");
  const [error, setError]   = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg(""); setError("");
    try {
      const res = await API.post("/auth/forgot-password", { email });
      setMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3>Forgot Password</h3>
      {message && <div className="alert alert-success">{message}</div>}
      {error   && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Enter your email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
        <button type="submit" className="btn btn-primary w-100">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
