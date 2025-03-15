import React from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <button className="modal-button" onClick={onButtonClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Modal;
