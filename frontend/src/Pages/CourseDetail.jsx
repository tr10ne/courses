// CourseDetail.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const { url } = useParams(); // Получаем параметр `url` из URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Запрос к API для получения курса по его `url`
    axios
      .get(`http://127.0.0.1:8000/api/courses/url/${url}`)
      .then((response) => {
        // Проверяем, если данные находятся в объекте с ключом 'data'
        const result = response.data
          ? response.data.data || response.data
          : null;

        if (result) {
          setCourse(result); // Устанавливаем данные курса
        } else {
          setError("Курс не найден"); // Обработка случая, если курс не найден
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке курса:", error);
        setError("Ошибка при загрузке данных курса");
      })
      .finally(() => {
        setLoading(false); // Завершаем загрузку
      });
  }, [url]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!course) {
    return <div>Курс не найден</div>;
  }

  return (
    <div>
      <h1>{course.name}</h1>
      <p>{course.description}</p>
      <p>Цена: {course.price}</p>
    </div>
  );
};

export default CourseDetail;
