import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import ReviewItem from "./ReviewItem";
import axios from "axios";
import { apiUrl } from "../../js/config.js";
import EditReviewForm from "./EditReviewForm";
import Loading from "../Loading.jsx";
import Modal from "../Modal"; // Добавьте импорт Modal

const ReviewItemWrapper = ({
  review,
  isGeneralPage = false,
  onDelete,
  onModerate,
  onUpdate,
}) => {
  const { user } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReview, setCurrentReview] = useState(review);
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
    setIsEditing(true);
  };

  // Сохранение изменений
  const handleSave = async (updatedData) => {
    try {
      await axios.put(
        `${apiUrl}/api/reviews/${review.id}`,
        { text: updatedData.text, rating: updatedData.rating }, // Передаем текст и оценку
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updatedReview = { ...currentReview, ...updatedData }; // Обновляем текущий отзыв
      setCurrentReview(updatedReview);
      if (onUpdate) onUpdate(review.id, updatedData); // Передаем обновленные данные через коллбэк
      setIsEditing(false);
      setModalProps({
        isOpen: true,
        title: "Успешно",
        message: "Изменения сохранены",
        buttonText: "Хорошо",
        buttonTextSecondary: "",
        onPrimaryClick: () => setModalProps({ ...modalProps, isOpen: false }),
        onSecondaryClick: () => {},
      });
    } catch (error) {
      setModalProps({
        isOpen: true,
        title: "Ошибка",
        message: "Не удалось сохранить изменения",
        buttonText: "ОК",
        buttonTextSecondary: "",
        onPrimaryClick: () => setModalProps({ ...modalProps, isOpen: false }),
        onSecondaryClick: () => {},
      });
    }
  };

  // Отмена редактирования
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      {isEditing ? (
        <EditReviewForm
          review={currentReview}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
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
        </>
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

export default ReviewItemWrapper;
