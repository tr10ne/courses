import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const CollapsibleList = ({ title, items, isOpen, onToggle }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 375);
  const [height, setHeight] = useState(isMobile ? 0 : "auto");
  const listRef = useRef(null);

  // Отслеживаю изменение ширины экрана
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 480;
      setIsMobile(mobile);

      // ОТкрываю список если устройство не мобильное
      if (!mobile) {
        setHeight("auto");
      } else {
        // Закрываю список если устройство мобильное
        setHeight(isOpen ? listRef.current.scrollHeight : 0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Изменение состояния isOpen
  useEffect(() => {
    if (isMobile) {
      setHeight(isOpen ? listRef.current.scrollHeight : 0);
    }
  }, [isOpen, isMobile]);

  // Переключение состояний
  const handleClick = () => {
    if (isMobile) {
      onToggle();
    }
  };

  return (
    <div className="footer__nav">
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
