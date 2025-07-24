import React, { useState } from "react";
import { useNavigate }           from "react-router-dom";
import API                       from "../api";

export default function Signup() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");                                       // clear previous errors
    console.log("Signup submitted", { email, password }); // debug

    try {
      await API.post("/auth/signup", { email, password });
      alert("Account created successfully. Please log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      // Show server’s message or a default
      const msg = err.response?.data?.message 
                || "Signup failed—please try again.";
      setError(msg);
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3>Create Account</h3>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>
      </form>

      <p className="mt-3 text-center">
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
}
