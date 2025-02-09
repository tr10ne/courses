import React from "react";
import SchoolFilter from "./SchoolFilter";

const SchoolsFilter = ({
	schools,
	disabledSchools,
	selectedSchools,
	handleSchoolCheckboxChange,
	checkedSchoolSpans,
	handleShowSchools,
}) => {
	return (
		<>
			<div className={`schools-filter  ${disabledSchools ? "disabled" : ""}`}>
				{schools.map((school) => (
					<SchoolFilter
                    key={school.id}
						school={school}
						selectedSchools={selectedSchools}
						handleSchoolCheckboxChange={handleSchoolCheckboxChange}
						checkedSchoolSpans={checkedSchoolSpans}
					/>
				))}
				;
			</div>

			<button
				className={`show-schools-btn ${schools.length > 5 ? "" : "hide"} ${
					disabledSchools ? "disabled" : ""
				}`}
				onClick={handleShowSchools}
			>
				Показать все школы ({schools.length - 5})
			</button>
		</>
	);
};

export default SchoolsFilter;
