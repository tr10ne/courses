import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Breadcrumbs from "../Components/Breadcrumbs";
import Pagination from "../Components/Pagination";
import Loading from "../Components/Loading";
import ReviewItem from "../Components/SchoolReviews/ReviewItem";
import { apiUrl } from "../js/config.js";
import AvgRatingStar from "../Components/AvgRatingStar";

const SchoolReviews = () => {
  const { url } = useParams();
  const [school, setSchool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isExpanded = false;
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
              <Link
                className="school-reviews__btn"
                to={`/schools/${school.url}`}
              >
                Курсы {school.name}
              </Link>
            </div>
          </div>
          <div className="school-reviews__bug" ref={RefTarget}>
            <div className="school-reviews__details">
              <AvgRatingStar className="detail" value={school.rating} />
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
