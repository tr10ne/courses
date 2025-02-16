import React from "react";
import { Link } from "react-router-dom";

const Category = ({ category, selectedCategoryId, handleCategoryChange }) => {
	const handleClick = () => {
		handleCategoryChange(category);
	};

	return (
		// <label
		// 	className={`categories-filter__lbl ${
		// 		selectedCategoryId === category.id ? "checked" : ""
		// 	}`}
		// >
		// 	{category.name}
		// 	<input
		// 		className="categories-filter__radio"
		// 		type="radio"
		// 		name="categories-filter-radio"
		// 		value={category.id}
		// 		onChange={handleClick}
		// 		onClick={handleClick}
		// 		checked={selectedCategoryId === category.id.toString()}
		// 	/>
		// </label>

		<Link
			className="categories-filter__link "
			to={`/courses/${category.url}`}
			onClick={handleClick}
		>
			{category.name}
		</Link>
	);
};

export default Category;
