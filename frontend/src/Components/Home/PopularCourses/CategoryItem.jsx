import React from "react";

const CategoryItem = ({ category, setActiveCategory, activeCategory }) => {
	return (
		<button
			className={`home-category-item ${
				activeCategory.id === category.id && "checked"
			}`}
			onClick={() => {
				setActiveCategory(category);
			}}
		>
			{category.name}
		</button>
	);
};

export default CategoryItem;
