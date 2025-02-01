import React, { useEffect, useState } from "react";
import axios from "axios";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/reviews")
      .then((response) => {
        console.log("Ответ от API:", response.data); // Проверьте структуру данных

        // Предполагаем, что ответ содержит массив отзывов напрямую
        if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else {
          console.error("Ожидался массив, но получено:", response.data);
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке отзывов:", error);
      });
  }, []);

  return (
    <div>
      <h1>Список отзывов</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Текст</th>
            <th>Оценка</th>
            <th>Пользователь</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(reviews) &&
            reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td>
                  <div dangerouslySetInnerHTML={{ __html: review.text }} />
                </td>
                <td>{review.rating}</td>
                <td>{review.user}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reviews;
