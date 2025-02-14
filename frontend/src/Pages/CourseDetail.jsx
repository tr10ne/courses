// CourseDetail.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiUrl } from "../js/config.js";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../Components/Breadcrumbs.jsx";

const CourseDetail = () => {
  const location = useLocation();
  const breadcrumbs = location.state?.breadcrumbs || [];

  const { url } = useParams(); // Получаем параметр `url` из URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Запрос к API для получения курса по его `url`
    axios
      .get(`${apiUrl}/api/courses/url/${url}`)
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
       <Breadcrumbs crumbs={breadcrumbs} />
      <h1>{course.name}</h1>
      <p>{course.description}</p>
      <p>Цена: {course.price}</p>
    </div>
  );
};

export default CourseDetail;
