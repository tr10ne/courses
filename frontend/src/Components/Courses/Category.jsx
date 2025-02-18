import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Category = ({
	category,
	handleCategoryChange,
	setSelectedCategory,
	paramCategoryUrl,
}) => {
	useEffect(() => {
		if (paramCategoryUrl === category.url) {
			setSelectedCategory(category);
		}
	}, [paramCategoryUrl, category, setSelectedCategory]);

	return (
		<Link
			className={`categories-filter__link ${
				paramCategoryUrl === category.url && "checked"
			}`}
			onClick={() => {
				handleCategoryChange(category);
			}}
			to={
				paramCategoryUrl === category.url
					? "/courses/"
					: `/courses/${category.url}`
			}
		>
			{category.name}
		</Link>
	);
};

export default Category;
