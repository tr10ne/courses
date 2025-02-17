import React from "react";
import { Link } from "react-router-dom";
import AvgRatingStar from "../AvgRatingStar";

const CourseItem = ({ course }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0, // Убираем дробные части
    }).format(price);
  };

  return (
    <div className="courses-list__item">
      <div className="course-name">
        <p className="course-name__title">
          <Link
            to={`/courses/${course.category.url}/${course.subcategory.url}/${course.url}`}
          >
            {course.name}
          </Link>
        </p>
        <p className="subcategoty-name">{course.subcategory_name}</p>
      </div>
      <div className="course-raiting">
        <div className="course-raiting__box">
          <AvgRatingStar value={course.average_rating} />
          <p className="course-reviewcount">
            <span>{course.reviews_count}</span> отзыва о курсе
          </p>
        </div>
      </div>
      <div className="course-price">
        <p className="course-price__value">{formatPrice(course.price)}</p>
      </div>
      <div className="course-link">
        <Link
          className="course-link__btn"
          target="_blank"
          to={`${course.link}`}
        >
          На сайт курса
        </Link>
        <Link
          className="course-link__btn course-link__btn_more"
          to={`/courses/${course.category.url}/${course.subcategory.url}/${course.url}`}
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
};

export default CourseItem;
