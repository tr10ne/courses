import React from "react";
import SchoolFilter from "./SchoolFilter";

const SchoolsFilter = ({
	schools,
	totalSchools,
	disabledSchools,
	selectedSchoolsId,
	handleSchoolCheckboxChange,
	handleShowSchools,
}) => {

	// Сортируем totalSchools так, чтобы школы из списка schools шли первыми
	const sortedSchools = [...totalSchools].sort((a, b) => {
		const isAInList = schools.some((s) => s.id === a.id);
		const isBInList = schools.some((s) => s.id === b.id);

		// Если a есть в списке, а b нет, a идет первым
		if (isAInList && !isBInList) return -1;
		// Если b есть в списке, а a нет, b идет первым
		if (!isAInList && isBInList) return 1;
		// Если оба есть или оба отсутствуют, порядок не меняется
		return 0;
	});

	return (
		<>
			<div className={`schools-filter  ${disabledSchools ? "disabled" : ""}`}>
				{sortedSchools.map((school) => {
					const isSchoolInList = schools.some((s) => s.id === school.id);
					return (
						<SchoolFilter
							key={school.id}
							school={school}
							selectedSchoolsId={selectedSchoolsId}
							handleSchoolCheckboxChange={handleSchoolCheckboxChange}
							isSchoolInList={isSchoolInList}
						/>
					);
				})}
			</div>

			<button
				className={`show-schools-btn ${totalSchools.length > 5 ? "" : "hide"} ${
					disabledSchools ? "disabled" : ""
				}`}
				onClick={handleShowSchools}
			>
				Показать все школы ({totalSchools.length - 5})
			</button>
		</>
	);
};

export default SchoolsFilter;
