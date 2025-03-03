import React, { useRef, useEffect } from "react";
import SchoolFilter from "./SchoolFilter";

const SchoolsFilter = ({
	schools,
	totalSchools,
	disabledSchools,
	selectedSchoolsId,
	handleSchoolCheckboxChange,
	handleShowSchools,
	isHiddenSchools,
	schoolsHeightRef,
}) => {
	const firstFiveSchoolRefs = useRef([]);

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

	// Вычисляем высоту первых 5 элементов после рендера
	useEffect(() => {
		if (firstFiveSchoolRefs.current.length > 0) {
			let totalHeight = 0;

			// Суммируем высоту первых 5 элементов
			firstFiveSchoolRefs.current.forEach((ref) => {
				if (ref) {
					totalHeight += ref.offsetHeight;
				}
			});

			schoolsHeightRef.current = totalHeight;
		}
	}, [sortedSchools, schoolsHeightRef]);

	return (
		<>
			<div className={`schools-filter  ${disabledSchools ? "disabled" : ""}`}>
				{sortedSchools.map((school, index) => {
					const isSchoolInList = schools.some((s) => s.id === school.id);

					const ref =
						index < 5
							? (el) => (firstFiveSchoolRefs.current[index] = el)
							: null;

					return (
						<SchoolFilter
							key={school.id}
							school={school}
							selectedSchoolsId={selectedSchoolsId}
							handleSchoolCheckboxChange={handleSchoolCheckboxChange}
							isSchoolInList={isSchoolInList}
							schoolsHeightRef={schoolsHeightRef}
							ref={ref}
						/>
					);
				})}
			</div>

			<button
				className={`show-schools-btn ${totalSchools.length > 5 ? "" : "hide"} ${
					disabledSchools ? "disabled" : ""
				}`}
				onClick={handleShowSchools}
				style={!isHiddenSchools ? { marginTop: 25 } : {}}
			>
				{isHiddenSchools
					? `Показать все школы (${totalSchools.length - 5})`
					: "Скрыть школы"}
			</button>
		</>
	);
};

export default SchoolsFilter;
