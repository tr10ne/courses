import React, { useState, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import Modal from "../Modal";

const EditReviewForm = ({ review, onSave, onCancel }) => {
  const [text, setText] = useState(review.text);
  const [isTextChanged, setIsTextChanged] = useState(false);
  const [modalProps, setModalProps] = useState({
    isOpen: false,
    title: "",
    message: "",
    buttonText: "Закрыть",
    buttonTextSecondary: "",
    onPrimaryClick: () => {},
    onSecondaryClick: () => {},
  });

  // Настройка Jodit
  const config = useMemo(
    () => ({
      readonly: false,
      spellcheck: true,
      language: "ru",
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      height: "auto",
      toolbar: false,
    }),
    []
  );

  // Отслеживаем изменения текста
  useEffect(() => {
    setIsTextChanged(text !== review.text);
  }, [text, review.text]);

  // Обработчик сохранения
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isTextChanged) {
      setModalProps({
        isOpen: true,
        title: "Сохранение изменений",
        message: "Вы хотите сохранить изменения в отзыве?",
        buttonText: "Да",
        buttonTextSecondary: "Нет",
        onPrimaryClick: () => {
          onSave(text);
          setModalProps({ isOpen: false });
        },
        onSecondaryClick: () => setModalProps({ isOpen: false }),
      });
    } else {
      onSave(text); // Если нет изменений, сразу сохраняем
    }
  };

  // Обработчик отмены
  const handleCancel = () => {
    if (isTextChanged) {
      setModalProps({
        isOpen: true,
        title: "Отмена изменений",
        message: "Вы уверены, что хотите выйти без сохранения?",
        buttonText: "Да, выйти",
        buttonTextSecondary: "Нет",
        onPrimaryClick: () => {
          onCancel();
          setModalProps({ isOpen: false });
        },
        onSecondaryClick: () => setModalProps({ isOpen: false }),
      });
    } else {
      onCancel();
    }
  };

  return (
    <form className="review-edit-form" onSubmit={handleSubmit}>
      <JoditEditor
        value={text}
        config={config}
        tabIndex={1}
        onChange={(newContent) => setText(newContent)}
      />
      <div className="review-actions">
        <button type="submit">Сохранить</button>
        <button type="button" onClick={handleCancel}>
          Отмена
        </button>
      </div>
      {modalProps.isOpen && (
        <Modal
          isOpen={modalProps.isOpen}
          onClose={() => setModalProps({ isOpen: false })}
          title={modalProps.title}
          message={modalProps.message}
          buttonText={modalProps.buttonText}
          secondaryButtonText={modalProps.buttonTextSecondary}
          onButtonClick={modalProps.onPrimaryClick}
          onSecondaryClick={modalProps.onSecondaryClick}
        />
      )}
    </form>
  );
};

export default EditReviewForm;
