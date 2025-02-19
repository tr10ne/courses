import React from "react";
import { Link } from "react-router-dom";

const SubcategoryList = ({ category }) => {
	return (
		<ul className="directions__subcategory-list">
			{category.subcategories.map((subcategory) => (
				<li className="directions__subcategory-item" key={subcategory.id}>
					<Link
						className="directions__subcategory-link"
						to={`/courses/${category.url}/${subcategory.url}`}
					>
						{subcategory.name}

						<svg viewBox="0 0 4.7002 8">
							<path d="M4.57 3.68 1.01.12A.447.447 0 0 0 .7 0a.43.43 0 0 0-.31.12L.13.38a.44.44 0 0 0 0 .62l2.99 2.99-3 3A.43.43 0 0 0 0 7.3c0 .11.04.22.12.31l.26.26c.09.08.2.13.31.13.12 0 .23-.05.31-.13L4.57 4.3c.08-.08.13-.19.13-.31 0-.11-.05-.22-.13-.31Z" />
						</svg>
					</Link>
				</li>
			))}
		</ul>
	);
};

export default SubcategoryList;
