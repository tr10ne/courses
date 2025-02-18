import React, { useState, forwardRef } from "react";
import Stars from "../Stars";

const ReviewForm = forwardRef(({ about }, ref) => {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь логика отправки формы
  };

  return (
    <div ref={ref} className="feedback-form">
      <p className="feedback-form__title">Оставить отзыв</p>
      <p className="feedback-form__desc">
        В данном разделе вы можете оставить ваш отзыв о {about}.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="star-rating" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                style={{ cursor: "pointer" }}
              >
                <Stars
                  className="form"
                  filled={star <= (hoverRating || rating)}
                />
              </span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="name" className="visually-hidden">
            Ваше имя
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя:"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="feedback" className="visually-hidden">
            Напишите ваш отзыв
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Напишите ваш отзыв:"
            required
          />
        </div>
        <button className="form-button" type="submit">
          Оставить отзыв
        </button>
      </form>
    </div>
  );
});

export default ReviewForm;
