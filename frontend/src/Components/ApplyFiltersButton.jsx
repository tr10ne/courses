import React, { useState, useEffect } from "react";

const ApplyFiltersButton = ({ onClick, buttonPosition }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Скрываем кнопку через 5 секунд после появления
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // 5000 мс = 5 секунд

      // Очищаем таймер при размонтировании или повторном рендере
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // При каждом новом появлении кнопки (изменение buttonPosition) сбрасываем видимость
  useEffect(() => {
    setIsVisible(true);
  }, [buttonPosition]);

  return (
    <button
      onClick={onClick}
      className={`apply-filters-button ${isVisible ? "visible" : "hidden"}`}
      style={{
        position: "fixed",
        left: `${buttonPosition.left}px`,
        top: `${buttonPosition.top}px`,
        transform: "translateY(-150%)",
      }}
    >
      Показать
    </button>
  );
};

export default ApplyFiltersButton;
