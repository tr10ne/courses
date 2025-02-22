import React, { useState, useEffect } from "react";

const MobileFilterWrapper = ({
  children,
  breakpoint = 1024,
  mobileClass = "mobile-filter-active",
  isFilterOpen, // Состояние открытия фильтра теперь приходит извне
  toggleFilter, // Функция переключения состояния приходит извне
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  // Если это не мобильная версия, просто рендерим children как есть
  if (!isMobile) {
    return <>{children}</>;
  }

  // Для мобильной версии рендерим children только если фильтр открыт
  return (
    <>
      {isFilterOpen &&
        React.cloneElement(children, {
          className: `${children.props.className || ""} ${mobileClass}`.trim(),
        })}
    </>
  );
};

export default MobileFilterWrapper;
