import React, { useState } from "react";
import { Link } from "react-router-dom";
import CategoriesList from "./CategoriesList";
import SchoolsList from "./SchoolsList";
import ReviewsList from "./ReviewsList";
import CoursesList from "./CoursesList";
import DifficultyLevelList from "./DifficultyLevelList";
import SocialIconList from "./SocialIconList";
import Logo from "../Logo";

const Footer = () => {
  // Состояние для хранения ID открытого списка
  const [openListId, setOpenListId] = useState("categories"); // По умолчанию открыт "categories"

  // Функция для обработки открытия/закрытия списка
  const handleToggleList = (id) => {
    setOpenListId((prevId) => (prevId === id ? null : id));
  };

  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="item item_1">
          <CategoriesList
            isOpen={openListId === "categories"}
            onToggle={() => handleToggleList("categories")}
          />
          <SchoolsList
            isOpen={openListId === "schools"}
            onToggle={() => handleToggleList("schools")}
          />
          <ReviewsList
            isOpen={openListId === "reviews"}
            onToggle={() => handleToggleList("reviews")}
          />
          <CoursesList
            isOpen={openListId === "courses"}
            onToggle={() => handleToggleList("courses")}
          />
          <DifficultyLevelList
            isOpen={openListId === "difficulty"}
            onToggle={() => handleToggleList("difficulty")}
          />
        </div>
        <div className="item item_2">
          <Logo />
        </div>
        <div className="item item_3">
          <small>&copy; 2021. Courses. Все права защищены.</small>
        </div>
        <div className="item item_4">
          <SocialIconList />
        </div>
        <div className="item item_5">
          <Link className="menu__link menu__link_footer" to="/terms">
            Пользовательское соглашение
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
