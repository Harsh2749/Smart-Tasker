import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post(
  "https://smarttasker-backend.onrender.com/api/auth/login",
  { email, password }
);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container-fluid login-container">
      <div className="row h-100">
        {/* ─── Left Form Column ────────────────────────────── */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="login-form-card p-4">
            {/* Logo + Title */}
            <div className="text-center mb-4">
              <img
                src="/SmartTaskerLogo.png"
                alt="SmartTasker"
                width={120}
                className="mb-3 d-block mx-auto"
              />
            </div>

            {/* Google Sign‑in */}
            <button
              type="button"
              className="btn btn-google mb-3 w-100"
              onClick={() =>
                (window.location.href = "https://smarttasker-backend.onrender.com/api/auth/google")
              }
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                style={{ height: 20, marginRight: 8 }}
              />
              Sign in with Google
            </button>

            <div className="text-center text-muted mb-3">
              Or sign in with email
            </div>

            {/* Email/Password Form */}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-2"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="form-control mb-2"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="keepLoggedIn"
                  />
                  <label className="form-check-label" htmlFor="keepLoggedIn">
                    Keep me logged in
                  </label>
                </div>
                <a href="/forgot-password" className="small">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="btn btn-primary-gradient w-100 mb-3"
              >
                Log In
              </button>
            </form>

            <p className="text-center small">
              Don’t have an account? <a href="/signup">Sign up</a>
            </p>
          </div>
        </div>

        {/* ─── Right Promo Column ───────────────────────────── */}
        <div className="col-md-6 d-none d-md-flex login-promo">
          <div className="promo-content text-white text-center d-flex align-items-center justify-content-center">
            <img
              src="/img.png"
              alt="SmartTasker Promo Banner"
              style={{ maxWidth: "80%", height: "auto", marginTop: "100px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
