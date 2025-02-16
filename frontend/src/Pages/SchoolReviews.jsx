import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Breadcrumbs from "../Components/Breadcrumbs";
import Pagination from "../Components/Pagination";
import Loading from "../Components/Loading";
import ReviewItem from "../Components/SchoolReviews/ReviewItem";
import { apiUrl } from "../js/config.js";

const SchoolReviews = () => {
  const { url } = useParams();
  const [school, setSchool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [queryParams, setQueryParams] = useState({
    page: 1,
    schoolurl: url,
  });

  const RefTarget = useRef(null);

  const scrollTo = (ref) => {
    const headerHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--header-height"
      ),
      15
    );
    const targetPosition = ref.current.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  };

  // Загрузка данных школы и отзывов
  useEffect(() => {
    const fetchSchoolAndReviews = async () => {
      try {
        // Загрузка данных школы
        const schoolResponse = await axios.get(
          `${apiUrl}/api/schools/url/${url}`
        );
        const schoolData = schoolResponse.data.data || schoolResponse.data;
        if (!schoolData) {
          setError("Школа не найдена");
          setLoading(false);
          return;
        }
        setSchool(schoolData);

        // Загрузка отзывов о школе с учетом пагинации
        const reviewsResponse = await axios.get(`${apiUrl}/api/reviews`, {
          params: {
            school_id: schoolData.id,
            page: queryParams.page,
          },
        });
        if (reviewsResponse.data) {
          setReviews(reviewsResponse.data.data || []);
          setPagination({
            current_page: reviewsResponse.data.meta.current_page || 1,
            last_page: reviewsResponse.data.meta.last_page || 1,
          });
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        setError("Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };
    fetchSchoolAndReviews();
  }, [url, queryParams.page]);

  // Обработчик изменения страницы
  const handlePageChange = (newPage) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));

    scrollTo(RefTarget);
  };

  // Функция для получения первых двух предложений описания
  const getFirstTwoSentences = (text) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 2) {
      return sentences.slice(0, 2).join(" ");
    }
    return text;
  };

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;
  if (!school) return <div>Школа не найдена</div>;

  const crumbs = [
    { path: "/", name: "Главная" },
    { path: "/schools", name: "Онлайн-школы" },
    { path: `/schools/${school.url}`, name: school.name },
    { path: "/reviews", name: "Отзывы" },
  ];

  const truncatedDescription = getFirstTwoSentences(school.description);

  return (
    <div className="container">
      <section className="school-reviews">
        <div className="school-reviews__head block-head">
          <Breadcrumbs crumbs={crumbs} />
          <h1>Отзывы {school.name}</h1>
          <div className="school-reviews__box">
            <div className="school-reviews__about">
              <div
                dangerouslySetInnerHTML={{
                  __html: isExpanded
                    ? school.description
                    : truncatedDescription,
                }}
              />
            </div>
            <div className="school-reviews__details">
              <button className="school-reviews__btn">
                <Link to={`/schools/${school.url}`}>Курсы {school.name}</Link>
              </button>
            </div>
          </div>
          <div className="school-reviews__bug" ref={RefTarget}>
            <div className="school-reviews__details">
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
              <p className="school-rating__description">
                {school.reviews} отзыв от пользователей
              </p>
            </div>
            <div className="school-reviews__sort">
              <span>Сортировка: по дате</span>
            </div>
            <div className="school-reviews__leave">
              <span className="school-reviews__link">Оставить отзыв</span>
            </div>
          </div>
        </div>
        <div className="school-reviews__sidebar"></div>
        <div className="school-reviews__body">
          <div className="review-list">
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        </div>
        <div className="school-reviews__footer">
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

export default SchoolReviews;
