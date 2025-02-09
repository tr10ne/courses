import React from "react";

const SchoolFilter = ({
    school,
    selectedSchools,
    handleSchoolCheckboxChange,
    checkedSchoolSpans
}) => {
    return (
            <label className="schools-filter__lbl" >
                {school.name}
                <input
                    className="schools-filter__checkbox"
                    type="checkbox"
                    checked={selectedSchools.includes(school.id)}
                    onChange={() => handleSchoolCheckboxChange(school.id)}
                />
                <span
                    className={`schools-filter__lbl__span ${
                        checkedSchoolSpans[school.id] ? "checked" : ""
                    }`}
                ></span>
            </label>
    );
};

export default SchoolFilter;
