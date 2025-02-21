import React from "react";

const CategoryItem = ({ category, setActiveCategoryId, activeCategoryId }) => {
	return (
		<button
			className={`popular-courses__category-item ${
				activeCategoryId === category.id && "checked"
			}`}
			onClick={() => {
				setActiveCategoryId(category.id);
			}}
		>
			{category.name}
		</button>
	);
};

export default CategoryItem;
