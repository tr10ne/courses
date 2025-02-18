import React from "react";
import { Link } from "react-router-dom";
import AvgRatingStar from "../AvgRatingStar";

const SchoolItem = ({ school }) => {
  return (
    <div className="school-item">
      <div className="school-item__body">
        <p className="school-title">
          <Link to={`/schools/${school.url}`}>{school.name}</Link>
        </p>
        <AvgRatingStar value={school.rating} />
        <p className="school-desc">
          <span>{school.courses}</span> курсов по <span>{school.themes}</span>{" "}
          темам
        </p>
        <p className="school-reviewcount">
          Отзывы о школе <span>{school.reviews}</span>
        </p>
        <div className="school-themes">
          {school.top_subcategories.map((subcategory, index) => (
            <span key={index}>{subcategory}</span>
          ))}
        </div>
      </div>
      <div className="school-item__link">
        <Link className="link-btn" to={`/schools/${school.url}`}>
          Подробнее
        </Link>
      </div>
    </div>
  );
};

export default SchoolItem;
