import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Breadcrumbs from "../Components/Breadcrumbs";
import Pagination from "../Components/Pagination";
import Loading from "../Components/Loading";
import ReviewItem from "../Components/Reviews/ReviewItem";
import { apiUrl } from "../js/config.js";
import CustomSelect from "../Components/SchoolReviews/CustomSelect";
import PageMetadata from "../Components/PageMetadata";
import { ReviewStatus } from "../js/ReviewStatus.js";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [queryParams, setQueryParams] = useState({
    page: 1,
  });
  const [sortBy, setSortBy] = useState({
    field: "date", // Поле для сортировки (date или rating)
    order: "desc", // Порядок сортировки (asc или desc)
  });
  const [lastUpdateDate, setLastUpdateDate] = useState(null); // Состояние для хранения даты последнего обновления
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviews = await axios.get(`${apiUrl}/api/reviews`, {
          params: {
            page: queryParams.page,
            sort_by: sortBy.field, // Поле для сортировки
            sort_order: sortBy.order, // Порядок сортировки
          },
        });
        if (reviews.data) {
          const data = reviews.data.data || [];
          setReviews(reviews.data.data || []);
          const latestDateReview = new Date(data[0].created_at);
          setLastUpdateDate(latestDateReview.toLocaleDateString()); // Устанавливаем дату последнего обновления

          setPagination({
            current_page: reviews.data.meta.current_page || 1,
            last_page: reviews.data.meta.last_page || 1,
          });
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [queryParams.page, sortBy]);

  const handlePageChange = (newPage) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
    scrollTo(RefTarget);
  };

  const crumbs = [
    { path: "/", name: "Главная" },
    { path: "/reviews", name: "Отзывы" },
  ];

  const handleSortChange = (field, order) => {
    setSortBy({ field, order });
    setQueryParams((prev) => ({ ...prev, page: 1 })); // Сбрасываем страницу на первую
  };

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (titleRef.current) {
      setTitle(titleRef.current.textContent);
    }

    if (descriptionRef.current) {
      setDescription(descriptionRef.current.textContent);
    }
  }, []);

  const ReviewsTitle = `Все ${title.toLowerCase()} | COURSES`;
  const ReviewsDescription = `${description.split(".")[0].trim()}`;

  return (
    <>
      <PageMetadata title={ReviewsTitle} description={ReviewsDescription} />
      <div className="container">
        <section className="reviews">
          <div className="reviews__head block-head">
            <Breadcrumbs crumbs={crumbs} />
            <h1 ref={titleRef}>Отзывы о курсах и онлайн школах</h1>
            <p className="reviews__desc" ref={descriptionRef}>
              Отзывы об онлайн школах, курсах от учеников и выпускников.
            </p>
            <div className="reviews__box" ref={RefTarget}>
              <div className="reviews__sort">
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
              <div className="reviews__lastmod">
                <p>
                  Последнее обновление:{" "}
                  <span className="lastmod-value">{lastUpdateDate}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="reviews__body">
            <div className="review-list">
              {loading ? (
                <Loading />
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewItem
                    key={review.id}
                    review={review}
                    isGeneralPage={true}
                  />
                ))
              ) : (
                <p>Отзывов пока нет.</p>
              )}
            </div>
            <div className="reviews__footer">
              <Pagination
                currentPage={pagination.current_page}
                lastPage={pagination.last_page}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Reviews;
