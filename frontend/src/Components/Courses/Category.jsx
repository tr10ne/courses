import React from "react";

const Category = ({ category, selectedCategoryId, handleCategoryChange }) => {
	const handleClick = () => {
		handleCategoryChange(category);
	};

	return (
		<label
			className={`categories-filter__lbl ${
				selectedCategoryId === category.id ? "checked" : ""
			}`}
		>
			{category.name}
			<input
				className="categories-filter__radio"
				type="radio"
				name="categories-filter-radio"
				value={category.id}
				onChange={handleClick}
				onClick={handleClick}
				checked={selectedCategoryId === category.id.toString()}
			/>
		</label>
	);
};

export default Category;
