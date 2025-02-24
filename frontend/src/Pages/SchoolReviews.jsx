import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Breadcrumbs from "../Components/Breadcrumbs";
import Pagination from "../Components/Pagination";
import Loading from "../Components/Loading";
import ReviewItem from "../Components/Reviews/ReviewItem";
import { apiUrl } from "../js/config.js";
import AvgRatingStar from "../Components/AvgRatingStar";
import ReviewsScore from "../Components/SchoolReviews/ReviewsScore";
import ReviewsOtherSchools from "../Components/SchoolReviews/ReviewsOtherSchools";
import CustomSelect from "../Components/SchoolReviews/CustomSelect";
import ReviewForm from "../Components/Reviews/ReviewForm";

const SchoolReviews = () => {
  const { url } = useParams();
  const [school, setSchool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [nearbySchools, setNearbySchools] = useState([]);
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
  const [sortBy, setSortBy] = useState({
    field: "date", // Поле для сортировки (date или rating)
    order: "desc", // Порядок сортировки (asc или desc)
  });

  const RefTarget = useRef(null);
  const reviewFormRef = useRef(null);

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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

        // Загрузка отзывов о школе с учетом пагинации и сортировки
        const reviewsResponse = await axios.get(`${apiUrl}/api/reviews`, {
          params: {
            school_id: schoolData.id,
            page: queryParams.page,
            sort_by: sortBy.field, // Поле для сортировки
            sort_order: sortBy.order, // Порядок сортировки
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
  }, [url, queryParams.page, sortBy]); // Добавляем sortBy в зависимости

  // Загрузка всех отзывов без пагинации
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/reviews`, {
          params: {
            school_id: school.id,
            limit: "all", // Получаем все отзывы
          },
        });
        if (response.data) {
          const allReviews = response.data.data || response.data;
          setAllReviews(allReviews);
        }
      } catch (error) {
        console.error("Ошибка при загрузке всех отзывов:", error);
      }
    };

    if (school) {
      fetchAllReviews();
    }
  }, [school]);

  // Загрузка всех школ и выбор 3 школ выше и 3 ниже текущей
  useEffect(() => {
    const fetchAllSchools = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/schools`, {
          params: {
            limit: "all", // Получаем все школы
          },
        });

        if (response.data) {
          const allSchools = response.data.data || response.data;

          if (!school || !allSchools.length) {
            setNearbySchools([]); // Если нет текущей школы или данных, очищаем список
            return;
          }

          // Находим индекс текущей школы
          const currentSchoolIndex = allSchools.findIndex(
            (s) => s.id === school.id
          );

          if (currentSchoolIndex === -1) {
            setNearbySchools([]); // Если текущая школа не найдена, очищаем список
            return;
          }

          const nearbySchools = [];

          // Добавляем школы перед текущей, пропуская те, у которых reviewsCount === 0
          for (
            let i = currentSchoolIndex - 1;
            i >= 0 && nearbySchools.length < 3;
            i--
          ) {
            if (allSchools[i].reviews > 0) {
              nearbySchools.unshift(allSchools[i]);
            }
          }

          // Добавляем школы после текущей, пропуская те, у которых reviewsCount === 0
          for (
            let i = currentSchoolIndex + 1;
            i < allSchools.length && nearbySchools.length < 6;
            i++
          ) {
            if (allSchools[i].reviews > 0) {
              nearbySchools.push(allSchools[i]);
            }
          }

          // Если школ меньше 6, дополняем с противоположной стороны, игнорируя schools с reviewsCount === 0
          while (nearbySchools.length < 6) {
            if (nearbySchools.length < 3) {
              // Добавляем с начала списка
              for (
                let i = 0;
                i < allSchools.length && nearbySchools.length < 3;
                i++
              ) {
                if (
                  allSchools[i].id !== school.id &&
                  allSchools[i].reviews > 0 &&
                  !nearbySchools.includes(allSchools[i])
                ) {
                  nearbySchools.unshift(allSchools[i]);
                }
              }
            } else {
              // Добавляем с конца списка
              for (
                let i = allSchools.length - 1;
                i >= 0 && nearbySchools.length < 6;
                i--
              ) {
                if (
                  allSchools[i].id !== school.id &&
                  allSchools[i].reviews > 0 &&
                  !nearbySchools.includes(allSchools[i])
                ) {
                  nearbySchools.push(allSchools[i]);
                }
              }
            }
          }

          // Ограничиваем результат 6 школами
          setNearbySchools(nearbySchools.slice(0, 6));
        }
      } catch (error) {
        console.error("Ошибка при загрузке всех школ:", error);
      }
    };

    if (school) {
      fetchAllSchools();
    }
  }, [school]);

  // Подсчет количества отзывов с каждой оценкой
  const countReviewsByRating = (reviews) => {
    return reviews.reduce(
      (acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      },
      { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    );
  };

  const reviewsByRating = countReviewsByRating(allReviews);

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

  // Обработчик изменения сортировки
  const handleSortChange = (field, order) => {
    setSortBy({ field, order });
    setQueryParams((prev) => ({ ...prev, page: 1 })); // Сбрасываем страницу на первую
  };

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
            <div className="school-reviews__btn">
              <Link
                className="school-reviews__link"
                to={`/schools/${school.url}`}
              >
                Курсы {school.name}
              </Link>
            </div>
            {isMobile && (
              <div className="school-reviews__details">
                <AvgRatingStar className="avg" value={school.rating} />
                <p className="school-rating__description">
                  {school.reviews} отзыв от пользователей
                </p>
              </div>
            )}
          </div>

          {!isMobile && (
            <div className="school-reviews__bag" ref={RefTarget}>
              <div className="school-reviews__details">
                <AvgRatingStar className="avg" value={school.rating} />
                <p className="school-rating__description">
                  {school.reviews} отзыв от пользователей
                </p>
              </div>
              <div className="school-reviews__sort">
                <p>Сортировка: </p>
                <CustomSelect
                  options={[
                    { value: "date_desc", label: "Сначала новые" },
                    { value: "date_asc", label: "Сначала старые" },
                    { value: "rating_desc", label: "Сначала положительные" },
                    { value: "rating_asc", label: "Сначала отрицательные" },
                  ]}
                  value={`${sortBy.field}_${sortBy.order}`}
                  onChange={(value) => {
                    const [field, order] = value.split("_");
                    handleSortChange(field, order);
                  }}
                />
              </div>

              <div className="school-reviews__leave">
                <span
                  className="school-reviews__toform"
                  onClick={() => {
                    const offset = 100; // Отступ сверху в пикселях (например, 50px)
                    const targetElement = reviewFormRef.current;

                    if (targetElement) {
                      const elementPosition =
                        targetElement.getBoundingClientRect().top +
                        window.pageYOffset;
                      window.scrollTo({
                        top: elementPosition - offset, // Вычитаем отступ
                        behavior: "smooth", // Плавная прокрутка
                      });
                    }
                  }}
                >
                  Оставить отзыв
                </span>
              </div>
            </div>
          )}
        </div>

        {!isMobile && (
          <aside className="school-reviews__sidebar">
            <div className="sidebar-box">
              <ReviewsScore
                totalReviews={allReviews.length}
                rating5={reviewsByRating[5]}
                rating4={reviewsByRating[4]}
                rating3={reviewsByRating[3]}
                rating2={reviewsByRating[2]}
                rating1={reviewsByRating[1]}
              />
              <ReviewsOtherSchools schools={nearbySchools} />
            </div>
          </aside>
        )}

        {isMobile && (
          <ReviewsScore
            totalReviews={allReviews.length}
            rating5={reviewsByRating[5]}
            rating4={reviewsByRating[4]}
            rating3={reviewsByRating[3]}
            rating2={reviewsByRating[2]}
            rating1={reviewsByRating[1]}
          />
        )}

        {isMobile && (
          <div className="school-reviews__bag" ref={RefTarget}>
            <div className="school-reviews__sort">
              <p>Сортировка: </p>
              <CustomSelect
                options={[
                  { value: "date_desc", label: "Сначала новые" },
                  { value: "date_asc", label: "Сначала старые" },
                  { value: "rating_desc", label: "Сначала положительные" },
                  { value: "rating_asc", label: "Сначала отрицательные" },
                ]}
                value={`${sortBy.field}_${sortBy.order}`}
                onChange={(value) => {
                  const [field, order] = value.split("_");
                  handleSortChange(field, order);
                }}
              />
            </div>

            <div className="school-reviews__leave">
              <span
                className="school-reviews__toform"
                onClick={() => {
                  const offset = 100; // Отступ сверху в пикселях (например, 50px)
                  const targetElement = reviewFormRef.current;

                  if (targetElement) {
                    const elementPosition =
                      targetElement.getBoundingClientRect().top +
                      window.pageYOffset;
                    window.scrollTo({
                      top: elementPosition - offset, // Вычитаем отступ
                      behavior: "smooth", // Плавная прокрутка
                    });
                  }
                }}
              >
                Оставить отзыв
              </span>
            </div>
          </div>
        )}

        <div className="school-reviews__body">
          {reviews.length === 0 ? (
            <p className="no-reviews-message">
              Пока здесь нет отзывов. Будьте первым - оставьте свой отзыв о{" "}
              {school.name}!
            </p>
          ) : (
            <>
              <div className="review-list">
                {reviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>
              <div className="school-reviews__footer">
                <Pagination
                  currentPage={pagination.current_page}
                  lastPage={pagination.last_page}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
          <ReviewForm about={school.name} ref={reviewFormRef} />
        </div>
        {isMobile && <ReviewsOtherSchools schools={nearbySchools} />}
      </section>
    </div>
  );
};

export default SchoolReviews;
