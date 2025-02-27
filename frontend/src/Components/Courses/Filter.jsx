import React from "react";
import ResetFilterButton from "./ResetFilterButton";
import Loading from "../Loading";
import PriceFilter from "./PriceFilter";
import SchoolsFilter from "./SchoolsFilter";

const Filter = ({
	handleFilterReset,
	loadingPrice,
	disabledFilter,
	sliderMin,
	sliderMax,
	sliderValues,
	handleSliderChange,
	handleSliderAfterChange,
	handleManualInputChange,
	schoolsBlockRef,
	loadingSchools,
	schools,
	totalSchools,
	selectedSchoolsId,
	handleSchoolCheckboxChange,
	handleShowSchools,
	handleFilterBtnClick
}) => {
	return (
		<div className={`courses-filter`}>
			<span className="courses-filter__header">
				Фильтры
				<ResetFilterButton handleFilterReset={handleFilterReset} />
			</span>

			<div className={`courses-filter__content scrollbar ${disabledFilter?'disabled':''}`}>
				<div className="courses-filter__block">
					<span className="courses-filter__content__title">Цена</span>
					{loadingPrice ? (
						<Loading />
					) : (
						<PriceFilter
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
						totalSchools.length > 5 ? "courses-filter__block_hide" : ""
					}`}
				>
					<span className="courses-filter__content__title">Школы:</span>

					{loadingSchools ? (
						<Loading />
					) : (
						<SchoolsFilter
							schools={schools}
							totalSchools={totalSchools}
							selectedSchoolsId={selectedSchoolsId}
							handleSchoolCheckboxChange={handleSchoolCheckboxChange}
							handleShowSchools={handleShowSchools}
						/>
					)}
				</div>

				<button className="courses-filter__button"
				onClick={handleFilterBtnClick}>
					Показать
				</button>
			</div>
		</div>
	);
};

export default Filter;
