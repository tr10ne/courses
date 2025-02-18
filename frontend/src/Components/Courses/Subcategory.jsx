import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Subcategory = ({
	subcategory,
	setSelectedSubcategory,
	handleSubcategoryClick,
	paramSubcategoryUrl,
	categoryUrl,
}) => {
	useEffect(() => {
		if (!paramSubcategoryUrl) {
			setSelectedSubcategory(null);
		} else if (paramSubcategoryUrl === subcategory.url) {
			setSelectedSubcategory(subcategory);
		}
	}, [paramSubcategoryUrl, subcategory, setSelectedSubcategory]);

	return (
		<Link
			className="courses__subcategories__item"
			key={subcategory.id}
			onClick={() => handleSubcategoryClick(subcategory)}
			to={`/courses/${categoryUrl}/${subcategory.url}`}
		>
			{subcategory.name}
		</Link>
	);
};

export default Subcategory;
