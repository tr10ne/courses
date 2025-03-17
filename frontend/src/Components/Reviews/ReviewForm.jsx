import React, {
  useState,
  useEffect,
  forwardRef,
  useContext,
  useCallback,
} from "react";
import { UserContext } from "../UserContext";
import { apiUrl } from "../../js/config.js";
import AuthModal from "../Auth/AuthModal";
import Modal from "../Modal";
import axios from "axios";
import Stars from "../Stars";
import JoditEditor from "jodit-react";

const ReviewForm = forwardRef(({ about, schoolId, courseId }, ref) => {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    isOpen: false,
    title: "",
    message: "",
    buttonText: "Закрыть",
  });

  useEffect(() => {
    if (user && user.name) {
      setName(user.name);
    }
  }, [user]);

  // Добавляем обработчик события beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const pendingReview = localStorage.getItem("pendingReview");
      if (pendingReview && !user) {
        localStorage.removeItem("pendingReview");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      setModalProps({
        ...modalProps,
        isOpen: true,
        title: "Внимательнее",
        message: "Пожалуйста, поставьте оценку",
        buttonText: "Понял",
      });
      return;
    }

    const reviewData = {
      text: feedback.trim(),
      rating: Number(rating),
      school_id: schoolId ? Number(schoolId) : undefined, // Для школ
      course_id: courseId ? Number(courseId) : undefined, // Для курсов
    };

    if (user) {
      try {
        console.log("Sending review data:", {
          ...reviewData,
          user_id: user.id,
        });

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
          setModalProps({
            ...modalProps,
            isOpen: true,
            title: "Спасибо за Ваш отзыв!",
            message:
              "Он будет опубликован в ближайшее время после проверки модератором.",
            buttonText: "Хорошо",
          });
          setName("");
          setFeedback("");
          setRating(0);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          console.error("Server validation errors:", error.response.data);
        } else {
          console.error("Network error:", error.message);
        }
      }
    } else {
      localStorage.setItem("pendingReview", JSON.stringify(reviewData));
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = useCallback(async () => {
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
          setModalProps({
            ...modalProps,
            isOpen: true,
            title: "Спасибо за Ваш отзыв!",
            message:
              "Он будет опубликован в ближайшее время после проверки модератором.",
            buttonText: "Хорошо",
          });
          setName("");
          setFeedback("");
          setRating(0);
          localStorage.removeItem("pendingReview");
        }
      } catch (error) {
        console.error("Ошибка при отправке сохраненного отзыва:", error);
      }
    }
    setShowAuthModal(false);
  }, [user, setModalProps, modalProps, setName, setFeedback, setRating]);

  useEffect(() => {
    if (user && JSON.parse(localStorage.getItem("pendingReview"))) {
      handleAuthSuccess();
    }
  }, [user, handleAuthSuccess]);

  return (
    <div ref={ref} className="feedback-form">
      <p className="feedback-form__title">Оставить отзыв</p>
      <p className="feedback-form__desc">
        {courseId
          ? `Здесь Вы можете оставить отзыв о курсе ${about}.`
          : `Здесь Вы можете оставить отзыв о школе ${about}.`}
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
      </form>
      {modalProps.isOpen && (
        <Modal
          isOpen={modalProps.isOpen}
          onClose={() => setModalProps({ ...modalProps, isOpen: false })}
          title={modalProps.title}
          message={modalProps.message}
          buttonText={modalProps.buttonText}
          onButtonClick={() => setModalProps({ ...modalProps, isOpen: false })}
        />
      )}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
});

export default ReviewForm;
