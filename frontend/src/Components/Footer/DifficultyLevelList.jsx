import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DifficultyLevelList = () => {
  // Состояние для отслеживания, свернут ли список
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Состояние для отслеживания ширины экрана
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 375);

  // Функция для переключения состояния свернуто/развернуто
  const toggleCollapse = () => {
    if (isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };
  // Эффект для отслеживания изменения ширины экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 375);
      // Если ширина экрана больше 375px, развернуть список
      if (window.innerWidth > 375) {
        setIsCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="footer__nav">
      {/* Добавляем обработчик клика на заголовок */}
      <div
        className="footer__nav__title"
        onClick={toggleCollapse}
        style={{ cursor: isMobile ? "pointer" : "default" }}
      >
        <p>Уровень сложности</p>
        <span>{isMobile && (isCollapsed ? "+" : "-")}</span>
      </div>
      {/* Условно рендерим список в зависимости от состояния */}
      {!isCollapsed && (
        <ul>
          <li>
            <Link className="menu__link menu__link_footer" to="#">
              Начальный
            </Link>
          </li>
          <li>
            <Link className="menu__link menu__link_footer" to="#">
              Средний
            </Link>
          </li>
          <li>
            <Link className="menu__link menu__link_footer" to="#">
              Профессиональный
            </Link>
          </li>
          <li>
            <Link className="menu__link menu__link_footer" to="#">
              Для детей
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default DifficultyLevelList;
