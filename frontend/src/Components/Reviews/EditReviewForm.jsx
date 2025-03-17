import React, { useState, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import Modal from "../Modal";
import Stars from "../Stars";

const EditReviewForm = ({ review, onSave, onCancel }) => {
  const [text, setText] = useState(review.text);
  const [rating, setRating] = useState(review.rating); // Добавляем состояние для оценки
  const [isTextChanged, setIsTextChanged] = useState(false);
  const [isRatingChanged, setIsRatingChanged] = useState(false); // Отслеживаем изменения в оценке
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
      toolbar: true,
    }),
    []
  );

  // Отслеживаем изменения текста
  useEffect(() => {
    setIsTextChanged(text !== review.text);
  }, [text, review.text]);

  // Отслеживаем изменения оценки
  useEffect(() => {
    setIsRatingChanged(rating !== review.rating);
  }, [rating, review.rating]);

  // Обработчик сохранения
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isTextChanged || isRatingChanged) {
      setModalProps({
        isOpen: true,
        title: "Сохранение изменений",
        message: "Вы хотите сохранить изменения в отзыве?",
        buttonText: "Да",
        buttonTextSecondary: "Нет",
        onPrimaryClick: () => {
          onSave({ text, rating }); // Передаем обновленный текст и оценку
          setModalProps({ isOpen: false });
        },
        onSecondaryClick: () => setModalProps({ isOpen: false }),
      });
    } else {
      onSave({ text, rating }); // Если нет изменений, сразу сохраняем
    }
  };

  // Обработчик отмены
  const handleCancel = () => {
    if (isTextChanged || isRatingChanged) {
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
      <div className="rating-edit">
        <p className="rating-edit__desc">Редактирование оценки:</p>
        <div className="star-rating" onMouseLeave={() => {}}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)} // Устанавливаем новую оценку
              style={{ cursor: "pointer" }}
            >
              <Stars filled={star <= rating} />
            </span>
          ))}
        </div>
      </div>
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
