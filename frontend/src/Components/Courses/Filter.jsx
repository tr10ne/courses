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
	loadingSchools,
	schools,
	totalSchools,
	selectedSchoolsId,
	handleSchoolCheckboxChange,
	handleFilterBtnClick,
	setIsHiddenSchools,
	isHiddenSchools,
}) => {
	//нажатие на кнопку показать все школы
	const handleShowSchools = () => {
		setIsHiddenSchools(!isHiddenSchools);
	};

	return (
		<div className={`courses-filter`}>
			<span className="courses-filter__header">
				Фильтры
				<ResetFilterButton handleFilterReset={handleFilterReset} />
			</span>

			<div
				className={`courses-filter__content scrollbar ${
					disabledFilter ? "disabled" : ""
				}`}
			>
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
					className={`courses-filter__block


					`}
					style={
						!isHiddenSchools ? { maxHeight: "100%" } : { maxHeight: "200px" }
					}
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
							isHiddenSchools={isHiddenSchools}
						/>
					)}
				</div>

				<button
					className="courses-filter__button"
					onClick={handleFilterBtnClick}
				>
					Показать
				</button>
			</div>
		</div>
	);
};

export default Filter;
