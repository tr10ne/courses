import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../js/config.js";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/reviews`)
      .then((response) => {
        console.log("Ответ от API:", response.data); // Проверка структуры данных

        // Проверяем, если данные находятся в объекте с ключом 'data'
        const result = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.data)
          ? response.data.data
          : null;

        // Если это массив, сохраняем в состояние
        if (Array.isArray(result)) {
          setReviews(result);
        } else {
          console.error("Ожидался массив, но получено:", result);
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
                <td>{review.user.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reviews;
