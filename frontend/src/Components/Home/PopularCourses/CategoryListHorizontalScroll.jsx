import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";


const CategoryListWithHorizontalScroll = ({
	categories,
	setActiveCategory,
	activeCategory,
}) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (categories) {
			setActiveCategory(categories[0]);

			setLoading(false);
		}
	}, [categories, setActiveCategory, setLoading]);

	if (loading) return;

	return (
		<div className="home-category-list scrollbar scrollbar_horizontal">
			{categories.map((category) => (
				<CategoryItem
					key={category.id}
					category={category}
					setActiveCategory={setActiveCategory}
					activeCategory={activeCategory}
				/>
			))}
		</div>
	);
};

export default CategoryListWithHorizontalScroll;
