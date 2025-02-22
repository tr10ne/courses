import React, { useState, useEffect, useRef } from "react";

const MobileFilterWrapper = ({
  children,
  breakpoint = 1024,
  mobileClass = "mobile-filter-active",
  isFilterOpen,
  toggleFilter,
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

  // Эффект для блокировки прокрутки при открытии фильтра
  useEffect(() => {
    const calculateHeight = () => {
      if (isMobile && isFilterOpen && filterRef.current) {
        filterRef.current.style.maxHeight = `${window.innerHeight}px`;
        document.body.style.overflow = "hidden";
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);

    return () => {
      window.removeEventListener("resize", calculateHeight);
      document.body.style.overflow = "auto";
    };
  }, [isMobile, isFilterOpen]);

  // Обработчик клика вне области фильтра
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Проверяем, что фильтр открыт и клик произошел вне его области
      if (
        isFilterOpen &&
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        toggleFilter();
      }
    };

    // Добавляем обработчик при открытии фильтра
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Очищаем обработчик при закрытии фильтра или размонтировании
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen, toggleFilter]);

  // Если это не мобильное устройство, просто возвращаем children
  if (!isMobile) {
    return <>{children}</>;
  }

  // Если это мобильное устройство и фильтр открыт, добавляем классы и обработчик
  return (
    <>
      {isFilterOpen &&
        React.cloneElement(children, {
          className: `${
            children.props.className || ""
          } mobile-filter-overlay`.trim(),
          children: React.cloneElement(children.props.children, {
            ref: filterRef, // Передаем ref на внутренний элемент
            className: `${
              children.props.children.props.className || ""
            } ${mobileClass}`.trim(),
          }),
        })}
    </>
  );
};

export default MobileFilterWrapper;
