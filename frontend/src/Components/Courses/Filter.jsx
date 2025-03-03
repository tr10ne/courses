import React, { useRef } from "react";
import ResetFilterButton from "./ResetFilterButton";
import Loading from "../Loading";
import PriceFilter from "./PriceFilter";
import SchoolsFilter from "./SchoolsFilter";
import Cross from "../Cross";

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
	filterButtonTop,
	filterButtonLeft,
	isFilterButtonVisible,
	filterButtonRef,
	filterRef,
	filterHeaderRef,
	filterContentRef,
	handleFilterCloseBtnClick
}) => {
	const schoolsHeightRef = useRef(null);

	//нажатие на кнопку показать все школы
	const handleShowSchools = () => {
		setIsHiddenSchools(!isHiddenSchools);
	};

	return (
		<div className="courses-filter-wrapper" ref={filterRef}>
			<button className="courses-filter-wrapper__close-button"
			onClick={handleFilterCloseBtnClick}>

			<Cross/>
			</button>
		<div className={`courses-filter`} >
			<span className="courses-filter__header" ref={filterHeaderRef}>
				Фильтры
				<ResetFilterButton handleFilterReset={handleFilterReset} />
			</span>

			<div
				className={`courses-filter__content scrollbar ${
					disabledFilter ? "disabled" : ""
				}`}
				ref={filterContentRef}
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
						!isHiddenSchools
							? { maxHeight: "100%" }
							: { maxHeight: schoolsHeightRef.current + 190 + "px" }
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
							schoolsHeightRef={schoolsHeightRef}
						/>
					)}
				</div>

				<button
					className={`courses-filter__button ${
						!isFilterButtonVisible ? "courses-filter__button_hidden" : ""
					}`}
					ref={filterButtonRef}
					onClick={handleFilterBtnClick}
					style={{
						top: `${filterButtonTop}px`,
						left: filterButtonLeft,
							}}
				>
					Показать
				</button>
			</div>
			</div>
		</div>
	);
};

export default Filter;
