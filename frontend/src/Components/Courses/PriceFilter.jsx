import React from "react";

import Slider from "rc-slider";

const PriceFilter = ({
	disabledPrise,
	sliderMin,
	sliderMax,
	sliderValues,
	handleSliderChange,
	handleSliderAfterChange,
	handleManualInputChange,
}) => {
	return (
		<div
			className={`courses-filter__content__price ${
				disabledPrise ? "disabled" : ""
			}`}
		>
			<Slider
				id={"price-filter__slider"}
				range
				min={sliderMin}
				max={sliderMax}
				value={sliderValues}
				onChange={handleSliderChange}
				onChangeComplete={handleSliderAfterChange}
				className="rc-slider"
			/>
			<div className="slider-labels">
				<input
					type="number"
					value={sliderValues[0] || 0}
					onChange={(e) => handleManualInputChange(0, e.target.value)}
					min={sliderMin}
					max={sliderValues[1]}
				/>
				<input
					type="number"
					value={sliderValues[1] || 0}
					onChange={(e) => handleManualInputChange(1, e.target.value)}
					min={sliderValues[0]}
					max={sliderMax}
				/>
			</div>
		</div>
	);
};

export default PriceFilter;
