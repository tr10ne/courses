import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Courses = () => {
  const recordsPerPage = 20; // Количество записей на странице

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // Состояние для отслеживания загрузки
  const [currentPage, setCurrentPage] = useState(1); // Состояние для отслеживания текущей страницы
  const [totalRecords, setTotalRecords] = useState(0); // Общее количество записей
  const [error, setError] = useState(null); // Состояние для ошибок

  const [selectedCategory, setSelectedCategory] = useState(null); // Состояние для выбранной категории
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    // const signal = controller.signal;

    const searchParams = new URLSearchParams(window.location.search);
    const filter = searchParams.get("search") || ""; // Используем значение из URL напрямую

    const params = {
      limit: recordsPerPage,
      offset: (currentPage - 1) * recordsPerPage,
      selectedCategory: selectedCategory,
      filter: filter, // Передаем фильтр
    };

    axios
      .get("http://127.0.0.1:8000/api/courses", { params })
      .then((response) => {
        setCourses(response.data.courses);
        setTotalRecords(response.data.total); // Устанавливаем общее количество записей
        setLoading(false); // Загрузка завершена
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setError("Не удалось загрузить курсы. Пожалуйста, попробуйте позже."); // Устанавливаем сообщение об ошибке
        setLoading(false); // Загрузка завершена
      });

    return () => controller.abort(); // Отмена запроса при размонтировании или изменении зависимостей
  }, [currentPage, selectedCategory]); // Убираем filter из зависимостей

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/categories")
      .then((response) => {
        console.log("Ответ от API:", response.data); // Проверьте структуру данных

        // Предполагаем, что ответ содержит массив курсов напрямую
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error("Ожидался массив, но получено:", response.data);
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке курсов:", error);
      });
  }, []);

  function getContent() {
    if (loading) return <p>Загрузка...</p>;

    if (error) return <p>{error}</p>; // Показываем сообщение об ошибке

    return (
      <>
        <ul className="courses-list">
          {courses.map((course) => (
            <li className="courses-item" key={course.id}>
              <div className="courses-item__about">
                <Link to={`/courses/${course.url}`}>{course.name}</Link>
                <p>{course.description}</p>
              </div>
              <div className="courses-item__controls">
                <Link className="courses-item__site" to={course.link}>
                  На сайт курса
                </Link>
                <Link className="courses-item__site" to={course.link}>
                  Подробнее
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Назад
          </button>
          {Array.from(
            { length: Math.ceil(totalRecords / recordsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                disabled={currentPage === i + 1} // Деактивируем кнопку для текущей страницы
              >
                {i + 1}
              </button>
            )
          )}
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === Math.ceil(totalRecords / recordsPerPage)}
          >
            Вперед
          </button>
        </div>
      </>
    );
  }

  function getCategories() {
    const handleCategoryChange = (e) => {
      const newCategory = e.target.value;

      // Если новая категория совпадает с текущей, сбрасываем выбор
      if (selectedCategory === newCategory) {
        setSelectedCategory(null);
      } else {
        setSelectedCategory(newCategory);
      }

      setCurrentPage(1);
    };

    return (
      <>
        {categories.map((category) => (
          <label
            className={`categories-filter__lbl ${
              selectedCategory === category.id.toString() ? "checked" : ""
            }`}
            key={category.id}
          >
            {category.name}
            <input
              className="categories-filter__radio"
              type="radio"
              name="categories-filter-radio"
              value={category.id}
              onChange={handleCategoryChange}
              onClick={handleCategoryChange}
              checked={selectedCategory === category.id.toString()} // Устанавливаем checked, если категория выбрана
            />
          </label>
        ))}
      </>
    );
  }

  const searchParams = new URLSearchParams(window.location.search);
  const filter = searchParams.get("search") || ""; // Получаем значение фильтра из URL

  return (
    <>
      <div className="block-intro">
        <div className="container">
          <h1 className="title">Онлайн-курсы</h1>
          <p className="text">
            Список всех онлайн-курсов с рейтингом, отзывами и детальным
            описанием курса 2025 года. Для удобства поиска курса используйте
            фильтры, сортировку, сравнение и поиск. Мы обновляем информацию о
            всех курсах каждую неделю.
          </p>
        </div>
      </div>

      <div className="categories-filter">
        <div className="categories-filter__inner container">
          {getCategories()}
        </div>
      </div>

      <div className="courses-main container">
        <div className="courses-filter">
          <p className="request-result-count">
            По вашему запросу {filter !== "" ? `"${filter}"` : ""} найдено{" "}
            {totalRecords} курсов
          </p>
        </div>

        <div className="courses-content">{getContent()}</div>
      </div>
    </>
  );
};

export default Courses;
