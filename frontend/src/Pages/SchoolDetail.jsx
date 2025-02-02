// SchoolDetail.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SchoolDetail = () => {
  const { url } = useParams(); // Получаем параметр `url` из URL
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Запрос к API для получения курса по его `url`
    axios
      .get(`http://127.0.0.1:8000/api/schools/url/${url}`)
      .then((response) => {
        // Проверяем, если данные находятся в объекте с ключом 'data'
        const result = response.data
          ? response.data.data || response.data
          : null;

        if (result) {
          setSchool(result); // Устанавливаем данные курса
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

  if (!school) {
    return <div>Школа не найдена</div>;
  }

  return (
    <div>
      <h1>{school.name}</h1>
      <div dangerouslySetInnerHTML={{ __html: school.description }} />
    </div>
  );
};

export default SchoolDetail;
