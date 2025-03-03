import React from "react";
import ArrowsFilter from "../ArrowsFilter";

const ResetFilterButton = ({ handleFilterReset }) => {
	return (
		<button className="courses-filter__reset-btn" onClick={handleFilterReset}>
			<ArrowsFilter />
		</button>
	);
};

export default ResetFilterButton;
