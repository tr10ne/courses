import React, { useRef, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const PriceFilter = ({
	disabledPrise,
	sliderMin,
	sliderMax,
	sliderValues,
	handleSliderChange,
	handleSliderAfterChange,
	handleManualInputChange,

	leftSliderRef,
	rightSliderRef,
	isMobile, // Добавляем пропс isMobile
}) => {
	const sliderRef = useRef(null);
	const sliderDraggingElemRef = useRef(null);

	useEffect(() => {
		if (sliderRef.current && leftSliderRef && rightSliderRef) {
			const sliderHandles =
				sliderRef.current.querySelectorAll(".rc-slider-handle");
			if (sliderHandles.length >= 2) {
				leftSliderRef.current = sliderHandles[0];
				rightSliderRef.current = sliderHandles[1];
			}
		}
	}, [leftSliderRef, rightSliderRef]);

	// const handleChangeComplete = (values) => {
	//   if (!isMobile) {
	//     // На десктопе применяем изменения сразу
	//     handleSliderAfterChange(values);
	//   } else {
	//     // На мобильных устройствах только уведомляем о финальном изменении
	//     handleSliderAfterChange(values);
	//   }
	// };

	return (
		<div
			className={`courses-filter__content__price ${
				disabledPrise ? "disabled" : ""
			}`}
		>
			<div ref={sliderRef}>
				<Slider
					id="price-filter__slider"
					range
					min={sliderMin}
					max={sliderMax}
					value={sliderValues}
					onChange={handleSliderChange}
					onChangeComplete={(values) => {
						const elem = sliderRef.current.querySelector(
							".rc-slider-handle-dragging"
						);

						if (elem) {
							sliderDraggingElemRef.current = elem;
						}

						handleSliderAfterChange(values, sliderDraggingElemRef.current);
					}}
					className="rc-slider"
				/>
			</div>
			<div className="slider-labels">
				<div>
					<input
						type="number"
						value={sliderValues[0] || 0}
						onChange={(e) => handleManualInputChange(0, e.target.value, e)}
						min={sliderMin}
						max={sliderValues[1]}
					/>
				</div>
				<div>
					<input
						type="number"
						value={sliderValues[1] || 0}
						onChange={(e) => handleManualInputChange(1, e.target.value, e)}
						min={sliderValues[0]}
						max={sliderMax}
					/>
				</div>
			</div>
		</div>
	);
};

export default PriceFilter;
