import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";


export default function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
      <div className="d-flex align-items-center">
        <img
          src="/SmartTaskerLogo.png"      
          alt="SmartTasker Logo"
          className="header-logo me-2"
        />
        <h2 className="mb-0">SmartTasker</h2>
      </div>
      <button
        type="button"
        className="btn btn-danger"
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>
  );
}
