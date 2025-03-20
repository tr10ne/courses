import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import ReviewItem from "./ReviewItem";
import axios from "axios";
import { apiUrl } from "../../js/config.js";
import Loading from "../Loading.jsx";
import Modal from "../Modal";
import { useNavigate, useLocation } from "react-router-dom";

const ReviewItemUserWrapper = ({
  review,
  isGeneralPage = true,
  onDelete,
  onModerate,
  onUpdate,
}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentReview] = useState(review);
  const [isLoading] = useState(false);
  const [modalProps, setModalProps] = useState({
    isOpen: false,
    title: "",
    message: "",
    buttonText: "Закрыть",
    buttonTextSecondary: "",
    onPrimaryClick: () => {},
    onSecondaryClick: () => {},
  });

  // Удаление
  const handleDelete = () => {
    setModalProps({
      isOpen: true,
      title: "Подтверждение удаления",
      message: "Вы уверены, что хотите удалить этот отзыв?",
      buttonText: "Удалить",
      buttonTextSecondary: "Отмена",
      onPrimaryClick: async () => {
        try {
          await axios.delete(`${apiUrl}/api/reviews/${review.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (onDelete) onDelete(review.id);
        } catch (error) {
          console.error("Ошибка при удалении отзыва:", error);
        }
        setModalProps({ ...modalProps, isOpen: false });
      },
      onSecondaryClick: () => setModalProps({ ...modalProps, isOpen: false }),
    });
  };

  // Модерация
  const handleModerate = (action) => {
    setModalProps({
      isOpen: true,
      title: `Подтвердите действие`,
      message: `Вы уверены, что хотите ${
        action === "approve" ? "одобрить" : "отклонить"
      } этот отзыв?`,
      buttonText: action === "approve" ? "Одобрить" : "Отклонить",
      buttonTextSecondary: "Отмена",
      onPrimaryClick: async () => {
        try {
          await axios.patch(
            `${apiUrl}/api/reviews/${review.id}/moderate`,
            { action },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (onModerate) onModerate(review.id, action);
        } catch (error) {
          console.error("Ошибка при модерации отзыва:", error);
        }
        setModalProps({ ...modalProps, isOpen: false });
      },
      onSecondaryClick: () => setModalProps({ ...modalProps, isOpen: false }),
    });
  };

  // Редактирование
  const handleEdit = () => {
    navigate(`/user/reviews/${review.id}`, {
      state: { review, previousPath: location.pathname },
    });
  };

  return (
    <>
      <div style={{ position: "relative", opacity: isLoading ? 0.5 : 1 }}>
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <Loading />
          </div>
        )}
        <ReviewItem review={currentReview} isGeneralPage={isGeneralPage} />
      </div>

      {/* Кнопки для модератора */}
      {user?.role === "moderator" && (
        <div className="review-actions">
          {currentReview.is_approved === null && (
            <>
              <button
                onClick={() => handleModerate("approve")}
                disabled={isLoading}
              >
                Одобрить
              </button>
              <button
                onClick={() => handleModerate("reject")}
                disabled={isLoading}
              >
                Отклонить
              </button>
            </>
          )}
          {currentReview.is_approved === true && (
            <button
              onClick={() => handleModerate("reject")}
              disabled={isLoading}
            >
              Отклонить
            </button>
          )}
          {currentReview.is_approved === false && (
            <button
              onClick={() => handleModerate("approve")}
              disabled={isLoading}
            >
              Одобрить
            </button>
          )}
          <button onClick={handleEdit} disabled={isLoading}>
            Редактировать
          </button>
          <button
            className="warning"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Удалить
          </button>
        </div>
      )}

      {/* Кнопки для пользователя */}
      {user?.role === "user" && currentReview.user_id === user.id && (
        <div className="review-actions">
          {currentReview.is_approved === null && (
            <button onClick={handleEdit} disabled={isLoading}>
              Редактировать
            </button>
          )}
          <button
            className="warning"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Удалить
          </button>
        </div>
      )}

      {modalProps.isOpen && (
        <Modal
          isOpen={modalProps.isOpen}
          onClose={() => setModalProps({ ...modalProps, isOpen: false })}
          title={modalProps.title}
          message={modalProps.message}
          buttonText={modalProps.buttonText}
          secondaryButtonText={modalProps.buttonTextSecondary}
          onButtonClick={modalProps.onPrimaryClick}
          onSecondaryClick={modalProps.onSecondaryClick}
        />
      )}
    </>
  );
};

export default ReviewItemUserWrapper;
