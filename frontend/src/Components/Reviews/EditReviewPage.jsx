import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../js/config.js";
import EditReviewForm from "./EditReviewForm";
import Loading from "../Loading.jsx";

const EditReviewPage = () => {
  const { review_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Используйте только один раз
  const [reviewData, setReviewData] = useState(null); // Переименовано для избежания путаницы
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем, есть ли данные отзыва в state
    if (location.state?.review) {
      setReviewData(location.state.review);
      setIsLoading(false);
    } else {
      // Если нет, загружаем данные с сервера
      const fetchReview = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/api/reviews/${review_id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setReviewData(response.data);
        } catch (error) {
          console.error("Ошибка при загрузке отзыва:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchReview();
    }
  }, [review_id, location.state]);

  const handleSave = async (updatedData) => {
    try {
      await axios.put(
        `${apiUrl}/api/reviews/${review_id}`,
        { text: updatedData.text, rating: updatedData.rating },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate(location.state?.previousPath || "/user/reviews");
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
    }
  };

  const handleCancel = () => {
    navigate(location.state?.previousPath || "/user/reviews");
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!reviewData) {
    return <div>Отзыв не найден</div>;
  }

  return (
    <div className="container review-edit">
      <h1>Редактирование отзыва</h1>
      <EditReviewForm
        review={reviewData}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditReviewPage;
