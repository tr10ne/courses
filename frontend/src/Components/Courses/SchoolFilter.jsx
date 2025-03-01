import React, { forwardRef } from "react";

const SchoolFilter = forwardRef(
  (
    { school, selectedSchoolsId, isSchoolInList, handleSchoolCheckboxChange },
    ref
  ) => {
    const isChecked = selectedSchoolsId.includes(school.id);

    return (
      <label
        className={`schools-filter__lbl ${
          isSchoolInList ? "" : "schools-filter__lbl_gray"
        }`}
        ref={ref}
      >
        {school.name}
        <input
          className="schools-filter__checkbox"
          type="checkbox"
          checked={isChecked}
          onChange={(e) => handleSchoolCheckboxChange(school.id, e)}
        />
        <span
          className={`schools-filter__lbl__span ${isChecked ? "checked" : ""}`}
        ></span>
      </label>
    );
  }
);

export default SchoolFilter;