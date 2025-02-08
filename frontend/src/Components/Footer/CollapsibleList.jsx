import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const CollapsibleList = ({ title, items, isOpen, onToggle }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 375);
  const [height, setHeight] = useState(isMobile ? 0 : "auto"); // Высота списка
  const listRef = useRef(null); // Ссылка на DOM-элемент списка

  // Эффект для отслеживания изменения ширины экрана
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 375;
      setIsMobile(mobile);

      // Если устройство стало НЕ мобильным, открываем список
      if (!mobile) {
        setHeight("auto");
      } else {
        // Если устройство стало мобильным, закрываем список
        setHeight(isOpen ? listRef.current.scrollHeight : 0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Эффект для обновления высоты списка при изменении состояния isOpen
  useEffect(() => {
    if (isMobile) {
      setHeight(isOpen ? listRef.current.scrollHeight : 0);
    }
  }, [isOpen, isMobile]);

  // Обработчик клика для переключения состояния
  const handleClick = () => {
    if (isMobile) {
      onToggle();
    }
  };

  return (
    <div className="footer__nav">
      {/* Заголовок списка */}
      <div
        className="footer__nav__title"
        onClick={handleClick}
        style={{ cursor: isMobile ? "pointer" : "default" }}
      >
        <p>{title}</p>
        <span className="collapse-control">
          {isMobile && (isOpen ? "-" : "+")}
        </span>
      </div>
      {/* Список с анимацией */}
      <ul
        ref={listRef}
        style={{
          overflow: "hidden",
          height: height,
          transition: isMobile
            ? "height 0.3s ease-in-out, margin-bottom 0.3s ease-in-out"
            : "none", // Анимация только для мобильных устройств
          marginBottom: isOpen && isMobile ? "25px" : "0", // Отступ только для мобильных устройств
        }}
      >
        {items.map((item, index) => (
          <li key={index}>
            <Link className="menu__link menu__link_footer" to={item.to}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollapsibleList;
