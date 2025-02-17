import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  useLayoutEffect,
} from "react";
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
  const [loading, setLoading] = useState(true); // Общий индикатор загрузки
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [sliderValues, setSliderValues] = useState([0, 0]);
  const [coursesLoading, setCoursesLoading] = useState(true); // Индикатор загрузки курсов
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false); // Индикатор загрузки подкатегорий

  const [queryParams, setQueryParams] = useState({
    page: 1,
    schoolurl: url,
    selectedSubcategories: [],
    minPrice: "",
    maxPrice: "",
  });

  const RefTarget = useRef(null);

  const scrollTo = useCallback((ref) => {
    const headerHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--header-height"
      ),
      12
    );
    const targetPosition = ref.current.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }, []);

  // Загрузка данных школы, подкатегорий и диапазона цен при первой загрузке
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Загружаем данные школы и все курсы для подкатегорий и диапазона цен
        const [schoolResponse, coursesResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/schools/url/${url}`),
          axios.get(`${apiUrl}/api/courses?schoolurl=${url}&limit=all`),
        ]);

        const schoolData = schoolResponse.data?.data || schoolResponse.data;

        if (!schoolData) {
          setError("Школа не найдена");
          return;
        }

        setSchool(schoolData);

        const coursesData = coursesResponse.data.courses || [];

        // Извлекаем уникальные подкатегории
        const uniqueSubcategories = Array.from(
          new Set(coursesData.map((course) => course.subcategory_name))
        ).map((name) => ({
          id: coursesData.find((course) => course.subcategory_name === name)
            .subcategory_id,
          name,
        }));

        setAllSubcategories(uniqueSubcategories);
        setFilteredSubcategories(uniqueSubcategories); // Инициализируем отфильтрованные подкатегории

        // Обновляем диапазон цен
        if (
          coursesResponse.data.min_total_price &&
          coursesResponse.data.max_total_price
        ) {
          setPriceRange([
            coursesResponse.data.min_total_price,
            coursesResponse.data.max_total_price,
          ]);
          setSliderValues([
            coursesResponse.data.min_total_price,
            coursesResponse.data.max_total_price,
          ]);
        }
      } catch (error) {
        setError("Ошибка при загрузке данных школы");
      } finally {
        setLoading(false); // Общий индикатор загрузки выключается
      }
    };

    fetchInitialData();
  }, [url]);

  // Загрузка курсов с учетом пагинации и фильтров
  useEffect(() => {
    const fetchCourses = async () => {
      setCoursesLoading(true); // Устанавливаем состояние загрузки курсов в true

      const subcategoriesQuery =
        queryParams.selectedSubcategories.length > 0
          ? `&selectedSubcategoryId=${queryParams.selectedSubcategories.join(
              ","
            )}`
          : "";

      const priceQuery = `&minPrice=${queryParams.minPrice}&maxPrice=${queryParams.maxPrice}`;

      try {
        const response = await axios.get(
          `${apiUrl}/api/courses?schoolurl=${url}&page=${queryParams.page}${subcategoriesQuery}${priceQuery}`
        );

        const data = response.data;
        setCourses(data.courses || []);
        setPagination({
          current_page: data.meta.current_page,
          last_page: data.meta.last_page,
        });
      } catch (error) {
        setError("Ошибка при загрузке курсов");
      } finally {
        setCoursesLoading(false); // Устанавливаем состояние загрузки курсов в false
      }
    };

    fetchCourses();
  }, [
    queryParams.page,
    queryParams.selectedSubcategories,
    queryParams.minPrice,
    queryParams.maxPrice,
    url,
  ]);

  // useEffect(() => {
  //   const calculateHeight = () => {
  //     const bodyElement = document.querySelector(".school-detail__body");
  //     const filterElement = document.querySelector(".subcategory-filter");

  //     if (bodyElement && filterElement) {
  //       const bodyHeight = bodyElement.offsetHeight;
  //       filterElement.style.maxHeight = `${bodyHeight}px`;
  //     }
  //   };

  //   // Вызываем функцию только после загрузки курсов
  //   if (courses.length > 0) {
  //     calculateHeight();
  //   }
  // }, [courses]); // Зависимость от courses

  const bodyRef = useRef(null);
  const [isFilterReady, setIsFilterReady] = useState(false);

  useLayoutEffect(() => {
    const calculateHeight = () => {
      const filterElement = document.querySelector(".subcategory-filter");

      if (bodyRef.current && filterElement) {
        const bodyHeight = bodyRef.current.offsetHeight;
        filterElement.style.maxHeight = `${bodyHeight}px`;
      }
    };

    if (isFilterReady) {
      calculateHeight();
    }
  }, [courses, isFilterReady]);

  // Загрузка подкатегорий при изменении цены
  useEffect(() => {
    if (!school) return;

    const fetchFilteredSubcategories = async () => {
      setSubcategoriesLoading(true);

      try {
        const response = await axios.get(
          `${apiUrl}/api/courses?schoolurl=${url}&limit=all&minPrice=${queryParams.minPrice}&maxPrice=${queryParams.maxPrice}`
        );

        const coursesData = response.data.courses || [];

        // Извлекаем уникальные подкатегории
        const uniqueSubcategories = Array.from(
          new Set(coursesData.map((course) => course.subcategory_name))
        ).map((name) => ({
          id: coursesData.find((course) => course.subcategory_name === name)
            .subcategory_id,
          name,
        }));

        setFilteredSubcategories(uniqueSubcategories);
      } catch (error) {
        setError("Ошибка при загрузке подкатегорий");
      } finally {
        setSubcategoriesLoading(false);
      }
    };

    fetchFilteredSubcategories();
  }, [queryParams.minPrice, queryParams.maxPrice, url, school]);

  // Обработчик изменения страницы
  const handleResetFilters = useCallback(() => {
    setQueryParams((prev) => ({
      ...prev,
      selectedSubcategories: [],
      minPrice: "",
      maxPrice: "",
      page: 1,
    }));
    setSliderValues([priceRange[0], priceRange[1]]);
    setFilteredSubcategories(allSubcategories);
  }, [priceRange, allSubcategories]);

  // Обработчик изменения выбранных подкатегорий
  const handleSubcategoryChange = useCallback((selectedSubcategories) => {
    setQueryParams((prev) => ({
      ...prev,
      selectedSubcategories,
      page: 1,
    }));
  }, []);

  // Обработчик изменения слайдера
  const handleSliderChange = useCallback((values) => {
    setSliderValues(values);
  }, []);

  // Обработчик завершения изменения слайдера
  const handleSliderAfterChange = useCallback((values) => {
    setQueryParams((prev) => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1],
      page: 1,
    }));
  }, []);

  // Обработчик ручного ввода
  const handleManualInputChange = useCallback(
    (index, value) => {
      const newValues = [...sliderValues];
      newValues[index] = Number(value);
      setSliderValues(newValues);

      setQueryParams((prev) => ({
        ...prev,
        minPrice: newValues[0],
        maxPrice: newValues[1],
        page: 1,
      }));
    },
    [sliderValues]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      setQueryParams((prev) => ({ ...prev, page: newPage }));
      scrollTo(RefTarget);
    },
    [scrollTo]
  );

  // Функция для получения первых двух предложений описания
  const getFirstTwoSentences = useCallback((text) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 2) {
      return sentences.slice(0, 2).join(" ");
    }
    return text;
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const crumbs = useMemo(
    () => [
      { path: "/", name: "Главная" },
      { path: "/schools", name: "Онлайн-школы" },
      { path: `/${school?.url}`, name: school?.name || "" },
    ],
    [school]
  );

  const truncatedDescription = useMemo(
    () => (school ? getFirstTwoSentences(school.description) : ""),
    [school, getFirstTwoSentences]
  );

  if (loading) {
    return <Loading />; // Показываем индикатор загрузки, пока данные загружаются
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!school) {
    return <div>Школа не найдена</div>;
  }

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
                <span onClick={toggleExpand} className="school-detail__link">
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
              <Link
                className="school-detail__btn"
                to={`/schools/${school.url}/reviews`}
              >
                <p className="school-reviewcount school-reviewcount_detail">
                  <span>{school.reviews}</span> отзывов о школе
                </p>
              </Link>
            </div>
          </div>
        </div>
        <aside className="school-detail__aside">
          <SubcategoryFilter
            onReady={() => setIsFilterReady(true)}
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
            loading={subcategoriesLoading}
          />
        </aside>
        <div
          className="school-detail__body"
          ref={(node) => {
            RefTarget.current = node;
            bodyRef.current = node;
          }}
        >
          <div className="courses-list">
            <div className="courses-list__head">
              <h2>Все курсы {school.name}</h2>
            </div>
            {coursesLoading ? (
              <Loading /> // Показываем индикатор загрузки курсов
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <CourseItem key={course.id} course={course} />
              ))
            ) : (
              <p>Курсы не найдены</p> // Показываем сообщение только после завершения загрузки
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
