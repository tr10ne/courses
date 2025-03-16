import React, { useEffect, useCallback } from "react";

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
  // Мемоизация функции handleKeyDown с помощью useCallback
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        onClose(); // Закрыть модальное окно при нажатии Escape
      }
      if (event.key === "Enter" && isOpen) {
        onButtonClick(); // Выполнить основное действие при нажатии Enter
      }
    },
    [isOpen, onClose, onButtonClick]
  );

  // Добавляем слушатель событий клавиатуры при монтировании компонента
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    // Удаляем слушатель событий при размонтировании или закрытии модального окна
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]); // Теперь handleKeyDown включен в массив зависимостей

  if (!isOpen) return null;

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
