import React from "react";

const SchoolFilter = ({
	school,
	selectedSchoolsId,
    isSchoolInList,
	handleSchoolCheckboxChange,
	// checkedSchoolSpans,
}) => {
	const isChecked = selectedSchoolsId.includes(school.id);

	return (
		<label className={`schools-filter__lbl ${
            isSchoolInList ? "" : "schools-filter__lbl_gray"
        }`}>
			{school.name}
			<input
				className="schools-filter__checkbox"
				type="checkbox"
				checked={isChecked}
				onChange={() => handleSchoolCheckboxChange(school.id)}
			/>
			<span
				className={`schools-filter__lbl__span ${isChecked ? "checked" : ""}`}
			></span>
		</label>
	);
};

export default SchoolFilter;
