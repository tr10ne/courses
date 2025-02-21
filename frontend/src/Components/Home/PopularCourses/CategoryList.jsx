import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";


const CategoryList = ({
	categories,
	setActiveCategoryId,
	activeCategoryId,
}) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (categories) {
			setActiveCategoryId(categories[0].id);

			setLoading(false);
		}
	}, [categories, setActiveCategoryId, setLoading]);

	if (loading) return;

	return (
		<div className="popular-courses__category-list scrollbar scrollbar_horizontal">
			{categories.map((category) => (
				<CategoryItem
					key={category.id}
					category={category}
					setActiveCategoryId={setActiveCategoryId}
					activeCategoryId={activeCategoryId}
				/>
			))}
		</div>
	);
};

export default CategoryList;
