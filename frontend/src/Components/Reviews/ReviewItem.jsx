import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import RatingStars from "../RatingStars";
import { UserContext } from "../UserContext"; // Импортируем UserContext

const ReviewItem = ({ review, isGeneralPage = false, isEditable = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useContext(UserContext); // Получаем данные пользователя из контекста
  const navigate = useNavigate();
  const location = useLocation();
  const getFirstTwoSentences = (text) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 5) {
      return sentences.slice(0, 5).join(" ");
    }
    return text;
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    navigate(`/user/reviews/${review.id}`, {
      state: { review, previousPath: location.pathname },
    });
  };

  const truncatedDescription = getFirstTwoSentences(review.text);

  const itemClass =
    review.rating === 5
      ? "review-list__item review-list__item_exelent"
      : "review-list__item";

  // Проверка наличия данных о курсе и школе
  const hasCourse = review.courses && review.courses.length > 0;
  const hasSchool = review.schools && review.schools.length > 0;

  return (
    <div
      className={`${itemClass} ${
        isGeneralPage ? "review-list__item_general" : ""
      }`}
    >
      <div className="item-head">
        {isGeneralPage && (
          <div className="item-name">
            Отзыв
            {hasCourse && (
              <>
                {" о курсе "}
                <Link
                  className="item-name__link"
                  to={`/courses/${review.courses[0].category_url}/${
                    review.courses[0].subcategory_url
                  }/${review.courses[0].url || "#"}`}
                >
                  {review.courses[0]?.name || "Неизвестный курс"}
                </Link>
                {hasSchool && (
                  <>
                    {" от "}
                    <Link
                      className="item-name__link"
                      to={`/schools/${review.schools[0]?.url || "#"}`}
                    >
                      {review.schools[0]?.name || "Неизвестная школа"}
                    </Link>
                  </>
                )}
              </>
            )}
            {hasSchool && !hasCourse && (
              <>
                {" о школе "}
                <Link
                  className="item-name__link"
                  to={`/schools/${review.schools[0]?.url || "#"}`}
                >
                  {review.schools[0]?.name || "Неизвестная школа"}
                </Link>
              </>
            )}
          </div>
        )}
        <div className="review-raiting">
          <RatingStars rating={review.rating} />
        </div>
        {!isGeneralPage && (
          <div className="review-date">
            {new Date(review.created_at).toLocaleDateString()}
          </div>
        )}
      </div>
      <div className="item-body">
        <div className="review-text">
          <div
            dangerouslySetInnerHTML={{
              __html: isExpanded ? review.text : truncatedDescription,
            }}
          />
        </div>
      </div>
      <div className="item-foot">
        <div className="review-text__detail">
          {review.text.length > truncatedDescription.length && (
            <span
              onClick={(e) => {
                e.preventDefault();
                toggleExpand();
              }}
              className="review-text__detail__link"
            >
              {isExpanded ? "Свернуть" : "Читать полностью →"}
            </span>
          )}
        </div>
        <div className="review-autor">
          {isEditable &&
            user &&
            user.id === review.user.id && ( // Проверяем, является ли текущий пользователь автором отзыва и разрешено ли редактирование
              <>
                <span onClick={handleEdit} className="review-edit-link">
                  Редактировать
                </span>
                <span>{" - "}</span>
              </>
            )}
          {review.user.name}
          {isGeneralPage && (
            <span className="review-date">
              {" - "}
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
