import React from "react";
import SchoolItem from "../Schools/SchoolItem";

const Schools = ({ selectedCategoryName, loadingCourses, schools }) => {
	if (selectedCategoryName && !loadingCourses && schools)
		return (
			<div className="courses__schools">
				<h2 className="courses__schools__title">{`Онлайн-школы преподающие ${selectedCategoryName}`}</h2>
				{schools.map((school) => {
					return <SchoolItem key={school.id} school={school} />;
				})}
			</div>
		);
};

export default Schools;
