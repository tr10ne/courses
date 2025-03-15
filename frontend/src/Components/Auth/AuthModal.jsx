import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthModal = ({ onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <div className="auth-tabs">
          <button
            className={`tab-link ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Войти
          </button>
          <button
            className={`tab-link ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Регистрация
          </button>
        </div>
        <div className="auth-tabs-content">
          {activeTab === "login" && (
            <div className="tab-content active" id="login">
              <Login onAuthSuccess={onAuthSuccess} />
            </div>
          )}
          {activeTab === "register" && (
            <div className="tab-content active" id="register">
              <Register onAuthSuccess={onAuthSuccess} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
