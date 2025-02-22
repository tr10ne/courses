import React, { useState, useEffect, useRef } from "react";

const MobileFilterWrapper = ({
  children,
  breakpoint = 1024,
  mobileClass = "mobile-filter-active",
  isFilterOpen,
  toggleFilter,
  onApplyFilters = () => {}, // Значение по умолчанию для onApplyFilters
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
  const filterRef = useRef(null);

  // Эффект для отслеживания изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  // Эффект для управления высотой на мобильных устройствах
  useEffect(() => {
    const calculateHeight = () => {
      if (isMobile && isFilterOpen && filterRef.current) {
        filterRef.current.style.maxHeight = `${window.innerHeight - 100}px`;
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);

    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, [isMobile, isFilterOpen]);

  // Обработчик клика вне области фильтра
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isFilterOpen &&
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        toggleFilter();
      }
    };

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen, toggleFilter]);

  // Если не мобильная версия, просто возвращаем children
  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <>
      {isFilterOpen &&
        React.cloneElement(children, {
          className: `${
            children.props.className || ""
          } mobile-filter-overlay`.trim(),
          children: React.cloneElement(children.props.children, {
            ref: filterRef,
            className: `${
              children.props.children.props.className || ""
            } ${mobileClass}`.trim(),
            onApplyFilters, // Передаем функцию применения фильтров
            isMobile, // Передаем флаг мобильной версии
          }),
        })}
    </>
  );
};

export default MobileFilterWrapper;
