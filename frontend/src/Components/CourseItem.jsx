import React from "react";
import { Link } from "react-router-dom";
import AvgRatingStar from "./AvgRatingStar";

const CourseItem = ({ course, foo, school }) => {
  if (foo) return <div className="courses-item courses-item_foo">{foo}</div>;

  return (
    <li className="courses-item ">
      <div className="courses-item__content">
        <Link
          className="courses-item__title"
          to={`/courses/${course.category.url}/${course.subcategory.url}/${course.url}`}
        >
          {course.name}
        </Link>

        <div className="courses-item__details">
          <AvgRatingStar value={course.average_rating} />

          <p className="courses-item__price">
            {course.price}
            <span className="courses-item__price__currency">руб.</span>
          </p>

          <p className="courses-item__reviews-count">
            Отзывовы о курсе: {course.reviews_count}
          </p>

          <p className="courses-item__school">
            {course.school ? course.school.name : "Не указана"}
          </p>
        </div>
      </div>
      <div className="courses-item__controls">
        <Link
          className="courses-item__more-link"
          target="_blank"
          to={course.link}
        >
          На сайт курса
        </Link>

        <Link
          className="courses-item__more-link"
          to={`/courses/${course.category.url}/${course.subcategory.url}/${course.url}`}
        >
          Подробнее
        </Link>
      </div>
    </li>
  );
};

export default CourseItem;
