import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import ReviewItem from "./ReviewItem";
import axios from "axios";
import { apiUrl } from "../../js/config.js";
import EditReviewForm from "./EditReviewForm"; // Импортируем форму редактирования
import Loading from "../Loading.jsx";

const ReviewItemWrapper = ({ review, isGeneralPage = false, onDelete, onModerate, onUpdate }) => {
  const { user } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false); // Состояние для режима редактирования
  const [currentReview, setCurrentReview] = useState(review); // Локальное состояние для отзыва
  const [isLoading, setIsLoading] = useState(false); // Состояние для отслеживания загрузки

  // Функция для удаления отзыва
  const handleDelete = async () => {
    const isConfirmed = window.confirm("Вы уверены, что хотите удалить этот отзыв?");
    if (!isConfirmed) {
      return;
    }

    setIsLoading(true); // Включаем состояние загрузки
    try {
      await axios.delete(`${apiUrl}/api/reviews/${review.id}`);
      if (onDelete) onDelete(review.id); // Вызов callback для удаления отзыва из списка
    } catch (error) {
      console.error("Ошибка при удалении отзыва:", error);
    } finally {
      setIsLoading(false); // Выключаем состояние загрузки
    }
  };

  // Функция для одобрения или отклонения отзыва
  const handleModerate = async (action) => {
    setIsLoading(true); // Включаем состояние загрузки
    try {
      await axios.patch(`${apiUrl}/api/reviews/${review.id}/moderate`, {
        action, // 'approve' или 'reject'
      });
      if (onModerate) onModerate(review.id, action); // Вызов callback для обновления списка
    } catch (error) {
      console.error("Ошибка при изменении статуса отзыва:", error);
    } finally {
      setIsLoading(false); // Выключаем состояние загрузки
    }
  };

  // Функция для редактирования отзыва
  const handleEdit = () => {
    setIsEditing(true); // Включаем режим редактирования
  };

  // Функция для сохранения изменений
  const handleSave = async (newText) => {
    setIsLoading(true); // Включаем состояние загрузки
    try {
      await axios.put(`${apiUrl}/api/reviews/${review.id}`, {
        text: newText,
      });
      // Обновляем локальное состояние отзыва
      const updatedReview = { ...currentReview, text: newText };
      setCurrentReview(updatedReview);
      if (onUpdate) onUpdate(review.id, newText); // Вызов callback для обновления отзыва
      setIsEditing(false); // Выключаем режим редактирования
    } catch (error) {
      console.error("Ошибка при редактировании отзыва:", error);
    } finally {
      setIsLoading(false); // Выключаем состояние загрузки
    }
  };

  // Функция для отмены редактирования
  const handleCancel = () => {
    setIsEditing(false); // Выключаем режим редактирования
  };

  return (
   <>

      {/* Если включен режим редактирования, показываем форму */}
      {isEditing ? (
        <EditReviewForm
          review={currentReview}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <>
         <div style={{ position: "relative", opacity: isLoading ? 0.5 : 1 }}>
      {/* Индикатор загрузки */}
      {isLoading && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}>
         <Loading/>
        </div>
      )}
          {/* Основной компонент ReviewItem с актуальными данными */}
          <ReviewItem review={currentReview} isGeneralPage={isGeneralPage} />
</div>
          {/* Кнопки для модератора */}
          {user?.role === "moderator" && (
            <div className="review-actions">
              {currentReview.is_approved === null && (
                <>
                  <button onClick={() => handleModerate("approve")} disabled={isLoading}>Одобрить</button>
                  <button onClick={() => handleModerate("reject")} disabled={isLoading}>Отклонить</button>
                </>
              )}
              {currentReview.is_approved === true && (
                <button onClick={() => handleModerate("reject")} disabled={isLoading}>Отклонить</button>
              )}
              {currentReview.is_approved === false && (
                <button onClick={() => handleModerate("approve")} disabled={isLoading}>Одобрить</button>
              )}
              <button onClick={handleEdit} disabled={isLoading}>Редактировать</button>
              <button className="warning" onClick={handleDelete} disabled={isLoading}>Удалить</button>
            </div>
          )}

          {/* Кнопки для пользователя */}
          {user?.role === "user" && currentReview.user_id === user.id && (
            <div className="review-actions">
              {currentReview.is_approved === null && (
                <button onClick={handleEdit} disabled={isLoading}>Редактировать</button>
              )}
              <button className="warning" onClick={handleDelete} disabled={isLoading}>Удалить</button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ReviewItemWrapper;