import React from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText,
  onButtonClick = onClose,
}) => {
  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        {title && <h2 className="modal-title">{title}</h2>}
        {message && <p className="modal-message">{message}</p>}

        {buttonText && (
          <button className="modal-button" onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
