import React from "react";
import Login from "./Login";
import Register from "./Register";

const AuthModal = ({ onClose, onAuthSuccess }) => {
  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <div className="auth-tabs">
          <button className="tab-link active" data-target="login">
            Войти
          </button>
          <button className="tab-link" data-target="register">
            Регистрация
          </button>
        </div>
        <div className="auth-tabs-content">
          <div className="tab-content active" id="login">
            <Login onAuthSuccess={onAuthSuccess} />
          </div>
          <div className="tab-content" id="register">
            <Register onAuthSuccess={onAuthSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
