import React from "react";
import { Link } from "react-router-dom";
import AvgRatingStar from "../AvgRatingStar";
import { formatPrice } from "../../js/formatPrice";

const CourseItem = ({ course, foo }) => {
  if (foo) return <div className="courses-item courses-item_foo">{foo}</div>;

  return (
    <li className="courses-item courses-item_frame">
      <div className="courses-item__content">
        <p className="courses-item__title">
          <Link
            to={`/courses/${course.category.url}/${course.subcategory.url}/${course.url}`}
          >
            {course.name}
          </Link>
        </p>
        <p className="expansion-name">
          <span>{course.subcategory_name || course.subcategory?.name}</span>
        </p>
        <p className="expansion-name expansion-name__schools">
          {course.school.name}
        </p>
      </div>
      <div className="courses-item__details">
        <div className="course-item__details__box">
          <AvgRatingStar value={course.average_rating} />
          <p className="courses-item__reviews-count">
            <span>{course.reviews_count}</span> отзыва о курсе
          </p>
        </div>
      </div>
      <div className="courses-item__price">
        <p className="courses-item__price__currency">
          {formatPrice(course.price)}
        </p>
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
          className="courses-item__more-link courses-item__more-link_course"
          to={`/courses/${course.category.url}/${course.subcategory.url}/${course.url}`}
        >
          Подробнее
        </Link>
      </div>
    </li>
  );
};

export default CourseItem;
