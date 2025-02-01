import React from "react";
import { Link } from "react-router-dom";
import CategoriesList from "./CategoriesList";
import SchoolsList from "./SchoolsList";
import ReviewsList from "./ReviewsList";
import CoursesList from "./CoursesList";
import DifficultyLevelList from "./DifficultyLevelList";
import SocialIconList from "./SocialIconList";
import Logo from "../Logo";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="item item_1">
          <CategoriesList />
          <SchoolsList />
          <ReviewsList />
          <CoursesList />
          <DifficultyLevelList />
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
