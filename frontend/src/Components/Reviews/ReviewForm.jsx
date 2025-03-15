import React, { useState, useEffect, forwardRef, useContext } from "react";
import { UserContext } from "../UserContext";
import { apiUrl } from "../../js/config.js";
import AuthModal from "../Auth/AuthModal";
import Modal from "../Modal";
import axios from "axios";
import Stars from "../Stars";
import JoditEditor from "jodit-react";

const ReviewForm = forwardRef(({ about, schoolId }, ref) => {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Эффект для предзаполнения имени, если пользователь залогинен
  useEffect(() => {
    if (user && user.name) {
      setName(user.name);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      setModalMessage("Пожалуйста, поставьте оценку");
      setIsModalOpen(true);
      return;
    }

    const reviewData = {
      text: feedback,
      rating,
      school_id: schoolId,
    };

    if (user) {
      // Залогиненный пользователь
      try {
        const response = await axios.post(
          `${apiUrl}/api/reviews`,
          { ...reviewData, user_id: user.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 201) {
          setModalMessage(
            "Спасибо за Ваш отзыв! Он будет опубликован в ближайшее время после проверки модератором."
          );
          setIsModalOpen(true);
          setTimeout(() => setIsModalOpen(false), 5000);
          // Очистить форму
          setName("");
          setFeedback("");
          setRating(0);
        }
      } catch (error) {
        console.error("Ошибка при отправке отзыва:", error);
      }
    } else {
      // Не залогиненный пользователь
      localStorage.setItem("pendingReview", JSON.stringify(reviewData));
      setShowAuthModal(true);
    }
  };

  // Обработчик успешной авторизации/регистрации
  const handleAuthSuccess = async () => {
    const pendingReview = JSON.parse(localStorage.getItem("pendingReview"));
    if (pendingReview && user) {
      try {
        const response = await axios.post(
          `${apiUrl}/api/reviews`,
          {
            ...pendingReview,
            user_id: user.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 201) {
          setIsSubmitted(true);
          setTimeout(() => setIsSubmitted(false), 5000);
          localStorage.removeItem("pendingReview");
        }
      } catch (error) {
        console.error("Ошибка при отправке сохраненного отзыва:", error);
      }
    }
    setShowAuthModal(false);
  };

  return (
    <div ref={ref} className="feedback-form">
      <p className="feedback-form__title">Оставить отзыв</p>
      <p className="feedback-form__desc">
        В данном разделе вы можете оставить ваш отзыв о {about}.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="star-rating" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                style={{ cursor: "pointer" }}
              >
                <Stars
                  className="form"
                  filled={star <= (hoverRating || rating)}
                />
              </span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="name" className="visually-hidden">
            Ваше имя
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя:"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="feedback" className="visually-hidden">
            Напишите ваш отзыв
          </label>
          <JoditEditor
            value={feedback}
            config={{
              readonly: false,
              spellcheck: true,
              language: "ru",
              showCharsCounter: false,
              showWordsCounter: false,
              showXPathInStatusbar: false,
              height: "auto",
              placeholder: "Напишите ваш отзыв...",
              toolbar: false,
            }}
            tabIndex={1}
            onBlur={(newContent) => setFeedback(newContent)}
            onChange={(newContent) => {}}
          />
        </div>
        <button className="form-button" type="submit">
          Оставить отзыв
        </button>
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={modalMessage.includes("Спасибо")}
            message={modalMessage}
            buttonText="Закрыть"
            onButtonClick={() => setIsModalOpen(false)}
          />
        )}
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
      </form>
    </div>
  );
});

export default ReviewForm;
