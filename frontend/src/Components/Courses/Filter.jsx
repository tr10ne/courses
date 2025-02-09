import React from "react";
import ResetFilterButton from "./ResetFilterButton";
import Loading from "../Loading";
import PriceFilter from "./PriceFilter";
import SchoolsFilter from "./SchoolsFilter";

const Filter = ({
	handleFilterReset,
	loadingPrice,
	disabledPrise,
	sliderMin,
	sliderMax,
	sliderValues,
	handleSliderChange,
	handleSliderAfterChange,
	handleManualInputChange,
	schoolsBlockRef,
	loadingSchools,
    schools,
	disabledSchools,
	selectedSchools,
	handleSchoolCheckboxChange,
	checkedSchoolSpans,
	handleShowSchools
}) => {
	return (
		<div className="courses-filter">
			<span className="courses-filter__header">
				Фильтры
				<ResetFilterButton handleFilterReset={handleFilterReset} />
			</span>

			<div className="courses-filter__content ">
				<div className="courses-filter__block">
					<span className="courses-filter__content__title">Цена</span>
					{loadingPrice ? (
						<Loading />
					) : (
						<PriceFilter
							disabledPrise={disabledPrise}
							sliderMin={sliderMin}
							sliderMax={sliderMax}
							sliderValues={sliderValues}
							handleSliderChange={handleSliderChange}
							handleSliderAfterChange={handleSliderAfterChange}
							handleManualInputChange={handleManualInputChange}
						/>
					)}
				</div>

				<div
					ref={schoolsBlockRef}
					className={`courses-filter__block ${
						schools.length > 5 ? "courses-filter__block_hide" : ""
					}`}
				>
					<span className="courses-filter__content__title">Школы:</span>

					{loadingSchools ? (
						<Loading />
					) : (
						<SchoolsFilter
							schools={schools}
							disabledSchools={disabledSchools}
							selectedSchools={selectedSchools}
							handleSchoolCheckboxChange={handleSchoolCheckboxChange}
							checkedSchoolSpans={checkedSchoolSpans}
							handleShowSchools={handleShowSchools}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Filter;
