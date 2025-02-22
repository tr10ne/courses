import React from "react";

const ApplyFiltersButton = ({ onClick, buttonPosition }) => {
  return (
    <button
      onClick={onClick}
      className="apply-filters-button"
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
