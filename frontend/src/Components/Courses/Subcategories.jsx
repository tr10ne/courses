import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../js/config";
import Subcategory from "./Subcategory";

const Subcategories = ({
	selectedCategory,
	loadingCourses,
	handleSubcategoryClick,
	setSelectedSubcategory,
	paramSubcategoryUrl,
}) => {
	const [subcategories, setSubcategories] = useState([]);

	//запрос к БД для получения категории и подкатегорий с ней связанных
	useEffect(() => {
		if (!selectedCategory) return;

		axios
			.get(`${apiUrl}/api/categories/${selectedCategory.id}`)
			.then((response) => {
				setSubcategories(response.data.subcategories);
			})
			.catch((error) => {
				console.error("Ошибка при загрузке категории:", error);
			});
	}, [selectedCategory]);

	if (subcategories && !loadingCourses)
		return (
			<div className="courses__subcategories">
				<h2 className="courses__subcategories__title">{`Категории курсов по направлению ${selectedCategory.name}`}</h2>
				<ul className="courses__subcategories__list">
					{subcategories.map((subcategory) => {
						return (
							<li key={subcategory.id}>
								<Subcategory
									subcategory={subcategory}
									handleSubcategoryClick={handleSubcategoryClick}
									paramSubcategoryUrl={paramSubcategoryUrl}
									setSelectedSubcategory={setSelectedSubcategory}
									categoryUrl={selectedCategory.url}
								/>
							</li>
						);
					})}
				</ul>
			</div>
		);
};

export default Subcategories;
