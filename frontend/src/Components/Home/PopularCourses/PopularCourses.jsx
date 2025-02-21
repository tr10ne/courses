import React, { useEffect, useState } from "react";
import CategoryList from "./CategoryList";
import PopularCourseList from "./PopularCourseList";

const PopularCourses = ({ categories }) => {
	const [loading, setLoading] = useState(true);
	const [activeCategoryId, setActiveCategoryId] = useState(null);
	const [nextPage, setNextPage] = useState(null);
	const [blocks, setBlocks] = useState([]);

	useEffect(() => {
		if (categories) {
			setActiveCategoryId(categories[0].id);
		}
	}, [categories]);

	useEffect(() => {
		if (categories && activeCategoryId) {
			setLoading(false);
			setBlocks([renderCourses(activeCategoryId)]);
		}
	}, [activeCategoryId, categories]);

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
			renderCourses(activeCategoryId, nextPage),
		]);
	};

	if (loading) return;

	return (
		<section className="popular-courses ">
			<h2 className="home-section__title container">Популярные онлайн-курсы</h2>
			<CategoryList
				categories={categories}
				setActiveCategoryId={setActiveCategoryId}
				activeCategoryId={activeCategoryId}
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
