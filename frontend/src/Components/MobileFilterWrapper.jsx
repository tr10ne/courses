import React, { useState, useEffect, useRef } from "react";

const MobileFilterWrapper = ({
  children,
  breakpoint = 1024,
  mobileClass = "mobile-filter-active",
  isFilterOpen,
  toggleFilter,
  onApplyFilters = () => {},
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  useEffect(() => {
    const calculateHeight = () => {
      if (isMobile && isFilterOpen && filterRef.current) {
        filterRef.current.style.maxHeight = `${window.innerHeight - 100}px`;
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

  if (!isMobile) {
    return <>{children}</>;
  }

  // Проверка, что children и его вложенные элементы валидны
  if (
    !children ||
    !React.isValidElement(children) ||
    !children.props.children
  ) {
    return null;
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
            onApplyFilters,
            isMobile,
            toggleFilter,
          }),
        })}
    </>
  );
};

export default MobileFilterWrapper;
