import React, { useEffect, useState } from "react";
import CategoryListWithHorizontalScroll from "./CategoryListHorizontalScroll.jsx";
import PopularCourseList from "./PopularCourseList";

const PopularCourses = ({ categories }) => {
	const [loading, setLoading] = useState(true);
	const [activeCategory, setActiveCategory] = useState(null);
	const [nextPage, setNextPage] = useState(null);
	const [blocks, setBlocks] = useState([]);

	useEffect(() => {
		if (categories) {
			setActiveCategory(categories[0]);
		}
	}, [categories]);

	useEffect(() => {
		if (categories && activeCategory) {
			setLoading(false);
			setBlocks([renderCourses(activeCategory.id)]);
		}
	}, [activeCategory, categories]);

	const renderCourses = (categoryId, page = 1) => {
		return (
			<PopularCourseList
			key={`${categoryId}-${page}`}
				categoryId={categoryId}
				page={page}
				setNextPage={setNextPage}
			/>
		);
	};

	const handleShowMore = () => {
		setBlocks((prevBlocks) => [
			...prevBlocks,
			renderCourses(activeCategory.id, nextPage),
		]);
	};

	if (loading) return;

	return (
		<section className="popular-courses ">
			<h2 className="home-section__title container">Популярные онлайн-курсы</h2>
			<CategoryListWithHorizontalScroll
				categories={categories}
				setActiveCategory={setActiveCategory}
				activeCategory={activeCategory}
			/>
			<div className="popular-courses__content container">
			{blocks}
			{nextPage && (
				<button
					className="popular-courses__show-more-btn"
					onClick={handleShowMore}
				>
					Посмотреть еще
				</button>
			)}
			</div>
		</section>
	);
};

export default PopularCourses;
