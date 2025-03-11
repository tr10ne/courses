import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import ReviewItem from "./ReviewItem";
import axios from "axios";
import { apiUrl } from "../../js/config.js";

import EditReviewForm from "./EditReviewForm"; // Импортируем форму редактирования


const ReviewItemWrapper = ({ review, isGeneralPage = false, onDelete, onModerate, onUpdate }) => {
  const { user } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false); // Состояние для режима редактирования

  // Функция для удаления отзыва
  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/api/reviews/${review.id}`);
      if (onDelete) onDelete(review.id); // Вызов callback для удаления отзыва из списка
    } catch (error) {
      console.error("Ошибка при удалении отзыва:", error);
    }
  };

  // Функция для одобрения или отклонения отзыва
  const handleModerate = async (action) => {
    try {
      await axios.patch(`${apiUrl}/api/reviews/${review.id}/moderate`, {
        action, // 'approve' или 'reject'
      });
      if (onModerate) onModerate(review.id, action); // Вызов callback для обновления списка
    } catch (error) {
      console.error("Ошибка при изменении статуса отзыва:", error);
    }
  };

// Функция для редактирования отзыва
const handleEdit = () => {
    setIsEditing(true); // Включаем режим редактирования
  };

  // Функция для сохранения изменений
  const handleSave = async (newText) => {
    try {
      await axios.put(`${apiUrl}/api/reviews/${review.id}`, {
        text: newText,
      });
      if (onUpdate) onUpdate(review.id, newText); // Вызов callback для обновления отзыва
      setIsEditing(false); // Выключаем режим редактирования
    } catch (error) {
      console.error("Ошибка при редактировании отзыва:", error);
    }
  };

  // Функция для отмены редактирования
  const handleCancel = () => {
    setIsEditing(false); // Выключаем режим редактирования
  };

  return (
    <div>
  {/* Если включен режим редактирования, показываем форму */}
  {isEditing ? (
        <EditReviewForm
          review={review}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <>


      {/* Основной компонент ReviewItem */}
      <ReviewItem review={review} isGeneralPage={isGeneralPage} />

      {/* Кнопки для модератора */}
      {user?.role === "moderator" && (
        <div className="review-actions">
          {review.is_approved === null && (
            <>
              <button onClick={() => handleModerate("approve")}>Одобрить</button>
              <button onClick={() => handleModerate("reject")}>Отклонить</button>
            </>
          )}
          {review.is_approved === true && (
            <button onClick={() => handleModerate("reject")}>Отклонить</button>
          )}
          {review.is_approved === false && (
            <button onClick={() => handleModerate("approve")}>Одобрить</button>
          )}
          <button onClick={handleEdit}>Редактировать</button>
          <button onClick={handleDelete}>Удалить</button>
        </div>
      )}

      {/* Кнопки для пользователя */}
      {user?.role === "user" && review.user_id === user.id && (
        <div className="review-actions">
          {review.is_approved === null && (
            <button onClick={handleEdit}>Редактировать</button>
          )}
          <button onClick={handleDelete}>Удалить</button>
        </div>
       )}
       </>
     )}
    </div>
  );
};

export default ReviewItemWrapper;