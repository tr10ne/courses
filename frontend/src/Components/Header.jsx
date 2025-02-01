import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isFixed, setIsFixed] = useState(false);
  const lastScrollTopRef = useRef(0);

  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMenuButtonClick = () => {
    setIsSearchOpen(false); // Закрываем поиск при открытии меню
    setIsMenuOpen((prev) => !prev); // Переключаем состояние меню
  };

  const handleSearchIconClick = () => {
    setIsMenuOpen(false); // Закрываем меню при открытии поиска
    setIsSearchOpen((prev) => !prev); // Переключаем состояние поиска
  };

  // Применяем стили для меню и поиска при изменении их состояния
  useEffect(() => {
    if (menuRef.current && headerRef.current) {
      if (isMenuOpen) {
        menuRef.current.style.translate = `0 ${headerRef.current.offsetHeight}px`;
        menuRef.current.style.opacity = "1";
      } else {
        menuRef.current.style.translate = "";
        menuRef.current.style.opacity = "";
      }
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (searchRef.current && headerRef.current) {
      if (isSearchOpen) {
        searchRef.current.style.translate = `0 ${headerRef.current.offsetHeight}px`;
        searchRef.current.style.opacity = "1";
      } else {
        searchRef.current.style.translate = "";
        searchRef.current.style.opacity = "";
      }
    }
  }, [isSearchOpen]);

  // Обработка скролла
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;

      if (currentScrollTop === 0) {
        setIsFixed(false);
        setIsVisible(true);
      } else {
        setIsFixed(true);

        if (currentScrollTop < lastScrollTopRef.current) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }

      lastScrollTopRef.current = currentScrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`header ${isFixed ? "header--fixed" : ""} ${
        isVisible ? "header--visible" : ""
      }`}
    >
      <div className="container header__inner">
        <div className="header__logo">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <nav ref={menuRef} className={`nav ${isMenuOpen ? "open" : ""}`}>
          <ul className="menu">
            <li className="menu__item">
              <Link className="menu__link" to="/courses">
                Курсы
              </Link>
            </li>
            <li className="menu__item">
              <Link className="menu__link" to="/schools">
                Школы
              </Link>
            </li>
            <li className="menu__item">
              <Link className="menu__link" to="/reviews">
                Отзывы
              </Link>
            </li>
          </ul>
        </nav>
        <div ref={searchRef} className={`search ${isSearchOpen ? "open" : ""}`}>
          <form className="search__form" method="get" action={"/courses"}>
            <button type="submit" className="search__button" id="searchButton">
              <svg viewBox="0 0 20 20" className="svg-loupe">
                <path d="M8.808 0C3.95 0 0 3.951 0 8.808c0 4.856 3.951 8.807 8.808 8.807 4.856 0 8.807-3.95 8.807-8.807S13.665 0 8.808 0Zm0 15.99c-3.96 0-7.182-3.223-7.182-7.182 0-3.96 3.222-7.182 7.182-7.182 3.96 0 7.181 3.222 7.181 7.182 0 3.96-3.222 7.181-7.181 7.181Z" />
                <path d="m19.762 18.612-4.661-4.661a.812.812 0 1 0-1.15 1.15l4.661 4.66a.81.81 0 0 0 1.15 0 .813.813 0 0 0 0-1.149Z" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Искать курсы..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search__input"
              name="search"
            />
          </form>
        </div>
        <div className="header__btns">
          <button
            type="button"
            className="search__button"
            id="showSearchButton"
            onClick={handleSearchIconClick}
          >
            <svg viewBox="0 0 20 20" className="svg-loupe">
              <path d="M8.808 0C3.95 0 0 3.951 0 8.808c0 4.856 3.951 8.807 8.808 8.807 4.856 0 8.807-3.95 8.807-8.807S13.665 0 8.808 0Zm0 15.99c-3.96 0-7.182-3.223-7.182-7.182 0-3.96 3.222-7.182 7.182-7.182 3.96 0 7.181 3.222 7.181 7.182 0 3.96-3.222 7.181-7.181 7.181Z" />
              <path d="m19.762 18.612-4.661-4.661a.812.812 0 1 0-1.15 1.15l4.661 4.66a.81.81 0 0 0 1.15 0 .813.813 0 0 0 0-1.149Z" />
            </svg>
          </button>
          <button
            className={`btn-menu ${isMenuOpen ? "active" : ""}`}
            onClick={handleMenuButtonClick}
          >
            <span className="btn-menu__line"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
