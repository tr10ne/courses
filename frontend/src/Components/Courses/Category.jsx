import React from "react";

const Category = ({ category, selectedCategoryId, handleCategoryChange }) => {
	return (
		<label
			className={`categories-filter__lbl ${
				selectedCategoryId === category.id.toString() ? "checked" : ""
			}`}
		>
			{category.name}
			<input
				className="categories-filter__radio"
				type="radio"
				name="categories-filter-radio"
				value={category.id}
				onChange={handleCategoryChange}
				onClick={handleCategoryChange}
				checked={selectedCategoryId === category.id.toString()}
			/>
		</label>
	);
};

export default Category;
