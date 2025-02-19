import React, { useState, useEffect } from "react";
import SubcategoryList from "./SubcategoryList";
import Loading from "../Loading";

const Directions = ({ categories }) => {
	const [activeCategory, setActiveCategory] = useState(null);
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		if (categories && categories.length > 0){
        setActiveCategory(categories[0]);
        setLoading(false);
        }
	}, [categories]);

	return (
		<section className="directions">
			<div className="container">
				<h2 className="home-section__title">Направления курсов</h2>
				{loading ? (
					<Loading />
				) : (
					<div className="directions__content">
						<ul className="directions__category-list">
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
				)}
			</div>
		</section>
	);
};

export default Directions;
