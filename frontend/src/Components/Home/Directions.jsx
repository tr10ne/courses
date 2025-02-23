import React, { useState, useEffect } from "react";
import SubcategoryList from "./SubcategoryList";
import Loading from "../Loading";
import CategoryListWithHorizontalScroll from "./PopularCourses/CategoryListHorizontalScroll.jsx";
import CategoryDropdown from "./PopularCourses/CategoryDropdown.jsx";

const Directions = ({ categories }) => {
	const [activeCategory, setActiveCategory] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (categories && categories.length > 0) {
			setActiveCategory(categories[0]);
			setLoading(false);
		}
	}, [categories]);

	return (
		<section className="directions">
				<h2 className="home-section__title container">Направления курсов</h2>
				{loading ? (
					<Loading />
				) : (
					<>
						<CategoryListWithHorizontalScroll
							categories={categories}
							setActiveCategory={setActiveCategory}
							activeCategory={activeCategory}
						/>
						<CategoryDropdown
							categories={categories}
							setActiveCategory={setActiveCategory}
							activeCategory={activeCategory}
						/>

					<div className="directions__content container">
						<ul
							className="directions__category-list"
						>
							{categories.map((category) => (
								<li className="directions__category-item" key={category.id}>
									<button
										className={`directions__category-btn ${
											activeCategory.id === category.id ? "active" : ""
										}`}
										onClick={() => setActiveCategory(category)}
									>
										{category.name}
									</button>
								</li>
							))}
						</ul>
						<SubcategoryList category={activeCategory} />
					</div>
					</>
				)}
		</section>
	);
};

export default Directions;
