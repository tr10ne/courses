import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../js/config";

const Subcategories = ({
	selectedCategoryId,
	loadingCourses,
	handleSubcategoryClick,
	setSelectedCategoryName
}) => {
	const [subcategories, setSubcategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);

	//запрос к БД для получения категории и подкатегорий с ней связанных
	useEffect(() => {
		if (!selectedCategoryId) return;

		axios
			.get(`${apiUrl}/api/categories/${selectedCategoryId}`)
			.then((response) => {
				setSelectedCategory(response.data.category);
				setSubcategories(response.data.subcategories);

			})
			.catch((error) => {
				console.error("Ошибка при загрузке категории:", error);
			});
		}, [selectedCategoryId]);

		useEffect(() => {
			if (!selectedCategoryId) setSelectedCategory(null);
		}, [selectedCategoryId]);

		useEffect(()=>{
			if(selectedCategory)
				setSelectedCategoryName(selectedCategory.name);
			//  eslint-disable-next-line react-hooks/exhaustive-deps
},[selectedCategory])

	if (selectedCategory &&  !loadingCourses)
	return (
		<div className="courses__subcategories">
			<h2 className="courses__subcategories__title">{`Категории курсов по направлению ${selectedCategory.name}`}</h2>
			<ul className="courses__subcategories__list">
				{subcategories.map((subcategory) => {
					return (
						<li
							className="courses__subcategories__item"
							key={subcategory.id}
							onClick={() => handleSubcategoryClick(subcategory)}
						>
							{subcategory.name}
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default Subcategories;
