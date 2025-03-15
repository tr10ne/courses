import React from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText,
  secondaryButtonText,
  onButtonClick = onClose,
  onSecondaryClick = onClose,
}) => {
  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        {title && <h2 className="modal-title">{title}</h2>}
        {message && <p className="modal-message">{message}</p>}

        <div className="buttons-block">
          {buttonText && (
            <button className="modal-button" onClick={onButtonClick}>
              {buttonText}
            </button>
          )}

          {secondaryButtonText && (
            <button
              className="modal-button modal-button_secondary"
              onClick={onSecondaryClick}
            >
              {secondaryButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
