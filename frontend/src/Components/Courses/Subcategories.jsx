import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../js/config";

const Subcategories = ({
	selectedCategoryId,
	selectedCategoryName,
	loadingCourses,
	handleSubcategoryClick,
}) => {
	const [subcategories, setSubcategories] = useState([]);

	//запрос к БД для получения категории и подкатегорий с ней связанных
	useEffect(() => {
		if (!selectedCategoryId) return;

		axios
			.get(`${apiUrl}/api/categories/${selectedCategoryId}`)
			.then((response) => {
				// setSelectedCategory(response.data.category);
				setSubcategories(response.data.subcategories);

			})
			.catch((error) => {
				console.error("Ошибка при загрузке категории:", error);
			});
		}, [selectedCategoryId]);



	if (selectedCategoryId &&  !loadingCourses)
	return (
		<div className="courses__subcategories">
			<h2 className="courses__subcategories__title">{`Категории курсов по направлению ${selectedCategoryName}`}</h2>
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
