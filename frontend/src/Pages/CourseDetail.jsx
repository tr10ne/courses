import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { apiUrl } from "../js/config.js";
import Breadcrumbs from "../Components/Breadcrumbs.jsx";
import Loading from "../Components/Loading.jsx";
import moment from "moment";
import ReviewItem from "../Components/Reviews/ReviewItem.jsx";
import CourseItem from "../Components/CourseDetail/CourseItem.jsx";
import CourseInfo from "../Components/CourseDetail/CourseInfo.jsx";
import SchoolInfo from "../Components/CourseDetail/SchoolInfo.jsx";
import { formatPrice } from "../js/formatPrice.js";
import PageMetadata from "../Components/PageMetadata.jsx";
import ReviewForm from "../Components/Reviews/ReviewForm.jsx";
import { UserContext } from "../Components/UserContext.jsx";

const CourseDetail = () => {
  const navigate = useNavigate();
  const { categoryUrl, subcategoryUrl, courseUrl } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const headerRef = useRef(null);
  const [crumbs, setCrumbs] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [schoolInfoOnTon, setSchoolInfoOnTon] = useState(null);
  const sidebarRef = useRef();
  const { user } = useContext(UserContext);
  const [userReview, setUserReview] = useState(null);

  //================================================================
  // РАБОТА С ЗАПРОСОМ

  useEffect(() => {
    if (!courseUrl) return;
    axios
      .get(
        `${apiUrl}/api/courses/${categoryUrl}/${subcategoryUrl}/${courseUrl}`
      )
      .then((response) => {
        const result = response.data
          ? response.data.data || response.data
          : null;
        if (result) {
          setCourse(result);
        } else {
          setError("Курс не найден");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          navigate("/404"); // Перенаправляем на страницу 404
        } else {
          console.error("Ошибка при загрузке курса:", error);
        }
        setError("Ошибка при загрузке данных курса");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [courseUrl, categoryUrl, subcategoryUrl, navigate]);

  //================================================================
  //ХЛЕБНЫЕ КРОШКИ

  useEffect(() => {
    if (!course) return;
    setCrumbs([
      { path: "/", name: "Главная" },
      { path: "/courses", name: "Онлайн-курсы" },
      {
        path: `/courses/${course.category.url}`,
        name: course.category.name,
      },
      {
        path: `/courses/${course.category.url}/${course.subcategory.url}`,
        name: course.subcategory.name,
      },
      {
        path: `/courses/${course.category.url}/${course.subcategory.url}/${course.url}`,
        name: course.name,
      },
    ]);
  }, [course]);

  //================================================================
  //РАБОТА С ВНУТРЕННЕЙ ЛОГИКОЙ

  //получение текущей ширины окна
  useEffect(() => {
    const handleResize = () => {
      setSchoolInfoOnTon(window.innerWidth > 680);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //адаптивная высота sideBar для разных размеров course__header
  useEffect(() => {
    const handleResize = () => {
      if (!course || !sidebarRef.current) return;

      if (window.innerWidth < 970) {
        sidebarRef.current.style.top = "";
      } else {
        const headerHeight = headerRef.current.offsetHeight;
        sidebarRef.current.style.top = `-${Math.floor(
          headerHeight / 2 + 40
        )}px`;
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [course]);

  const reviewFormRef = useRef(null);

  useEffect(() => {
    if (user && course) {
      axios
        .get(`${apiUrl}/api/reviews`, {
          params: {
            course_id: course.id,
            user_id: user.id,
            limit: 1,
          },
        })
        .then((response) => {
          setUserReview(response.data.data[0] || null);
        })
        .catch((error) => console.error("Ошибка проверки отзыва:", error));
    }
  }, [user, course]);

  //=======================================================
  //SEO

  const CourseDetailTitle = `Курс ${course?.name} от ${
    course?.school.name
  }: цена ${formatPrice(
    course?.price
  )}, отзывы студентов, описание и программа | COURSES`;

  const CourseDetailDescription = `Описание и программа курса ${
    course?.name
  } от онлайн-школы ${
    course?.school.name
  }. Рейтинг, оценки и отзывы учеников. Актуальная цена ${formatPrice(
    course?.price
  )}.`;

  //=======================================================
  //ОТРИСОВКА ЭЛЕМЕНТОВ

  //отрисовываем отзывы
  const renderReview = () => {
    const approvedReviews = course.reviews.filter(
      (review) => review.is_approved
    );
    const reviewsToShow = approvedReviews.slice(0, visibleReviews);

    if (approvedReviews.length === 0)
      return (
        <p className="no-reviews-message">
          Пока здесь нет отзывов. Будьте первым - оставьте свой отзыв о{" "}
          {course.name}!
        </p>
      );

    return (
      <>
        {reviewsToShow.map((review, index) => (
          <ReviewItem key={index} review={review} />
        ))}
        {visibleReviews < approvedReviews.length && (
          <button
            className="course__reviews-link"
            onClick={() => setVisibleReviews(visibleReviews + 3)}
          >
            Еще отзывы о курсе
          </button>
        )}
      </>
    );
  };

  //отрисовываем связанные курсы
  const renderRelatedCourses = () => {
    if (!course) return;
    if (course.related_courses.length === 0) return;
    return (
      <article className="course__block">
        <h2 className="course__title">Похожие курсы</h2>
        {course.related_courses.map((relatedCourse) => (
          <CourseItem key={relatedCourse.id} course={relatedCourse} />
        ))}
      </article>
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (!error)
    return (
      <>
        <PageMetadata
          title={CourseDetailTitle}
          description={CourseDetailDescription}
        />
        <section className="course">
          <div className="course__header" ref={headerRef}>
            <div className=" container">
              <div className="course__header__inner">
                <Breadcrumbs crumbs={crumbs} />
                <h1 className="title">{course.name}</h1>
                <p className="course__updated-at">
                  Последнее обновление{" "}
                  {moment(course.updated_at).format("DD.MM.YYYY")}
                </p>
              </div>
            </div>
          </div>

          <div className="course__main container text">
            <div className="course__content">
              <article className="course__block">
                <h2 className="course__title">О курсе</h2>
                <p className="course__description ">{course.description}</p>
              </article>
              {!schoolInfoOnTon && (
                <article className="course__block course__sidebar">
                  <SchoolInfo school={course.school} />
                </article>
              )}
              <article className="course__block">
                <h2 className="course__title">
                  Отзывы о курсе{" "}
                  {userReview ? (
                    <span
                      className="school-reviews__toform"
                      onClick={() => {
                        const offset = 90; // Отступ сверху в пикселях (например, 50px)
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
                      Вы уже оставляли отзыв
                    </span>
                  ) : (
                    <span
                      className="school-reviews__toform"
                      onClick={() => {
                        const offset = 90; // Отступ сверху в пикселях (например, 50px)
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
                  )}
                </h2>
                {renderReview()}
                {userReview ? (
                  <div className="current-user-review" ref={reviewFormRef}>
                    <h3 className="current-user-review__title">
                      Это Ваш отзыв о курсе {course.name}:
                    </h3>
                    <ReviewItem review={userReview} />
                  </div>
                ) : (
                  <ReviewForm
                    about={course.name}
                    courseId={course.id}
                    ref={reviewFormRef}
                  />
                )}
              </article>
              {renderRelatedCourses()}
            </div>
            <aside className="course__sidebar" ref={sidebarRef}>
              <CourseInfo course={course} />
              {schoolInfoOnTon && <SchoolInfo school={course.school} />}
            </aside>
          </div>
        </section>
      </>
    );
};

export default CourseDetail;
