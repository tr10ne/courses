import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Breadcrumbs from "../Components/Breadcrumbs";
import Pagination from "../Components/Pagination";
import { apiUrl } from "../js/config.js";
import CourseItem from "../Components/SchoolDetail/CourseItem";
import SubcategoryFilter from "../Components/SchoolDetail/SubcategoryFilter";
import Loading from "../Components/Loading";

const SchoolDetail = () => {
  const { url } = useParams();
  const [school, setSchool] = useState(null);
  const [courses, setCourses] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]); // Все подкатегории
  const [filteredSubcategories, setFilteredSubcategories] = useState([]); // Отфильтрованные подкатегории
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [sliderValues, setSliderValues] = useState([0, 0]);

  const handleResetFilters = () => {
    setQueryParams((prev) => ({
      ...prev,
      selectedSubcategories: [],
      minPrice: 0,
      maxPrice: 0,
      page: 1,
    }));
    setSliderValues([priceRange[0], priceRange[1]]);
    setFilteredSubcategories(allSubcategories); // Сбрасываем фильтр подкатегорий
  };

  const [queryParams, setQueryParams] = useState({
    page: 1,
    schoolurl: url,
    selectedSubcategories: [],
    minPrice: 0,
    maxPrice: 0,
  });

  // Загрузка данных школы и всех подкатегорий
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/schools/url/${url}`)
      .then((response) => {
        const result = response.data
          ? response.data.data || response.data
          : null;
        if (result) {
          setSchool(result);

          // Загружаем все курсы школы для извлечения подкатегорий
          axios
            .get(`${apiUrl}/api/courses?schoolurl=${url}&limit=all`)
            .then((response) => {
              const coursesData = response.data.courses || [];

              // Извлекаем уникальные подкатегории
              const uniqueSubcategories = Array.from(
                new Set(coursesData.map((course) => course.subcategory_name))
              ).map((name) => ({
                id: coursesData.find(
                  (course) => course.subcategory_name === name
                ).subcategory_id,
                name,
              }));

              setAllSubcategories(uniqueSubcategories);
              setFilteredSubcategories(uniqueSubcategories); // Инициализируем отфильтрованные подкатегории

              // Обновляем диапазон цен
              if (
                priceRange[1] === 0 &&
                response.data.min_total_price &&
                response.data.max_total_price
              ) {
                setPriceRange([
                  response.data.min_total_price,
                  response.data.max_total_price,
                ]);
                setSliderValues([
                  response.data.min_total_price,
                  response.data.max_total_price,
                ]);
              }
            })
            .catch((error) => {
              console.error("Ошибка при загрузке курсов:", error);
            });
        } else {
          setError("Школа не найдена");
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке школы:", error);
        setError("Ошибка при загрузке данных школы");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  // Загрузка курсов для школы с пагинацией и фильтрами
  useEffect(() => {
    if (!school) return;

    const subcategoriesQuery =
      queryParams.selectedSubcategories.length > 0
        ? `&selectedSubcategoryId=${queryParams.selectedSubcategories.join(
            ","
          )}`
        : "";

    const priceQuery =
      queryParams.minPrice > 0 || queryParams.maxPrice > 0
        ? `&minPrice=${queryParams.minPrice}&maxPrice=${queryParams.maxPrice}`
        : "";

    axios
      .get(
        `${apiUrl}/api/courses?schoolurl=${url}&page=${queryParams.page}${subcategoriesQuery}${priceQuery}`
      )
      .then((response) => {
        const data = response.data;
        const coursesData = data.courses || [];

        setCourses(coursesData);
        setPagination({
          current_page: data.meta.current_page,
          last_page: data.meta.last_page,
        });

        // Если пользователь изменил диапазон цен, обновляем отфильтрованные подкатегории
        if (queryParams.minPrice > 0 || queryParams.maxPrice > 0) {
          const filteredSubcategories = Array.from(
            new Set(coursesData.map((course) => course.subcategory_name))
          ).map((name) => ({
            id: coursesData.find((course) => course.subcategory_name === name)
              .subcategory_id,
            name,
          }));

          setFilteredSubcategories(filteredSubcategories);
        } else {
          // Если диапазон цен сброшен, показываем все подкатегории
          setFilteredSubcategories(allSubcategories);
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке курсов:", error);
      });
  }, [
    school,
    queryParams.page,
    queryParams.selectedSubcategories,
    queryParams.minPrice,
    queryParams.maxPrice,
    url,
    allSubcategories.length,
    priceRange,
  ]);

  // Обработчик изменения страницы
  const handlePageChange = (newPage) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  // Обработчик изменения выбранных подкатегорий
  const handleSubcategoryChange = (selectedSubcategories) => {
    setQueryParams((prev) => ({
      ...prev,
      selectedSubcategories,
      page: 1,
    }));
  };

  // Обработчик изменения слайдера
  const handleSliderChange = (values) => {
    setSliderValues(values);
  };

  // Обработчик завершения изменения слайдера
  const handleSliderAfterChange = (values) => {
    setQueryParams((prev) => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1],
      page: 1,
    }));
  };

  // Обработчик ручного ввода
  const handleManualInputChange = (index, value) => {
    const newValues = [...sliderValues];
    newValues[index] = Number(value);
    setSliderValues(newValues);

    setQueryParams((prev) => ({
      ...prev,
      minPrice: newValues[0],
      maxPrice: newValues[1],
      page: 1,
    }));
  };

  // Функция для получения первых двух предложений описания
  const getFirstTwoSentences = (text) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 2) {
      return sentences.slice(0, 2).join(" ");
    }
    return text;
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!school) {
    return <div>Школа не найдена</div>;
  }

  const crumbs = [
    { path: "/", name: "Главная" },
    { path: "/schools", name: "Онлайн-школы" },
    { path: `/${school.url}`, name: school.name },
  ];

  const truncatedDescription = getFirstTwoSentences(school.description);

  return (
    <div className="container">
      <section className="school-detail">
        <div className="school-detail__head block-head">
          <Breadcrumbs crumbs={crumbs} />
          <h1>{school.name}</h1>
          <div className="school-detail__box">
            <div className="school-detail__about">
              <div
                dangerouslySetInnerHTML={{
                  __html: isExpanded
                    ? school.description
                    : truncatedDescription,
                }}
              />
              {school.description.length > truncatedDescription.length && (
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    toggleExpand();
                  }}
                  className="school-detail__link"
                >
                  {isExpanded ? "Свернуть" : "Подробнее..."}
                </span>
              )}
            </div>
            <div className="school-detail__details">
              <div className="school-rating school-rating_detail">
                <svg viewBox="0 0 14 13.3563" fill="none">
                  <path
                    d="M6.61 0.23C6.68 0.09 6.83 0 6.99 0C7.16 0 7.31 0.09 7.38 0.23L9.06 3.63C9.22 3.95 9.52 4.18 9.87 4.23L13.63 4.77C13.79 4.8 13.92 4.91 13.97 5.07C14.02 5.22 13.98 5.39 13.87 5.51L11.15 8.15C10.89 8.4 10.78 8.76 10.84 9.11L11.48 12.85C11.51 13.01 11.44 13.17 11.31 13.27C11.18 13.37 11 13.38 10.85 13.3L7.5 11.54C7.18 11.37 6.81 11.37 6.49 11.54L3.13 13.3C2.99 13.38 2.81 13.37 2.68 13.27C2.55 13.17 2.48 13.01 2.51 12.85L3.15 9.11C3.21 8.76 3.1 8.4 2.84 8.15L0.12 5.51C0.01 5.39 -0.03 5.22 0.02 5.07C0.07 4.91 0.2 4.8 0.36 4.77L4.12 4.23C4.47 4.18 4.77 3.95 4.93 3.63L6.61 0.23Z"
                    fill="#FFB800"
                    fillOpacity="1.000000"
                    fillRule="nonzero"
                  />
                </svg>
                <p className="rating-value rating-value_detail">
                  {school.rating}
                </p>
              </div>
              <button className="school-detail__btn">
                <Link to={`/schools/${school.url}/reviews`}>
                  <p className="school-reviewcount school-reviewcount_detail">
                    <span>{school.reviews}</span> отзывов о школе
                  </p>
                </Link>
              </button>
            </div>
          </div>
        </div>
        <SubcategoryFilter
          subcategories={filteredSubcategories} // Используем отфильтрованные подкатегории
          selectedSubcategories={queryParams.selectedSubcategories}
          onSubcategoryChange={handleSubcategoryChange}
          sliderMin={priceRange[0]}
          sliderMax={priceRange[1]}
          sliderValues={sliderValues}
          handleSliderChange={handleSliderChange}
          handleSliderAfterChange={handleSliderAfterChange}
          handleManualInputChange={handleManualInputChange}
          onReset={handleResetFilters}
        />
        <div className="school-detail__body">
          <div className="courses-list">
            <div className="courses-list__head">
              <h2>Все курсы {school.name}</h2>
            </div>
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseItem key={course.id} course={course} />
              ))
            ) : (
              <p>Нет курсов в данной школе</p>
            )}
          </div>
        </div>
        <div className="school-detail__footer">
          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </div>
  );
};

export default SchoolDetail;
