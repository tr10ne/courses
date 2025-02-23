

import React, { useState, useEffect, useRef } from "react";

const CategoryDropdown = ({
	categories,
	setActiveCategory,
	activeCategory,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false); // Состояние для анимации
	const dropdownRef = useRef(null);

	// Закрытие списка при клике вне его
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Анимация открытия/закрытия
	useEffect(() => {
		if (isOpen) {
			setIsAnimating(true); // Запускаем анимацию открытия
		} else {
			setIsAnimating(false); // Останавливаем анимацию
		}
	}, [isOpen]);

	const handleCategoryClick = (category) => {
		setActiveCategory(category);
		setIsOpen(false);
	};

	// Фильтруем выбранную категорию из списка
	const filteredCategories = categories.filter(
		(category) => category.id !== activeCategory?.id
	);

	return (
		<div className="home-category-dropdown" ref={dropdownRef}>
			<div
				className="home-category-dropdown-item"
				onClick={() => setIsOpen(!isOpen)}
			>
				{activeCategory?.name || "Select a category"}
				<svg
					className={`dropdown-arrow ${isOpen ? "rotate" : ""}`}
					viewBox="0 0 129 129"
				>
					<path d="M121.3 34.6c-1.6-1.6-4.2-1.6-5.8 0l-51 51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8 0-1.6 1.6-1.6 4.2 0 5.8l53.9 53.9c.8.8 1.8 1.2 2.9 1.2 1 0 2.1-.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2.1-5.8z" />
				</svg>
			</div>
			{isOpen && (
				<ul className="dropdown-list">
					{filteredCategories.map((category, index) => (
						<li
							key={category.id}
							className={`dropdown-item ${isAnimating ? "animate" : ""}`}
							style={{ animationDelay: `${index * 0.1}s` }} // Задержка для каждого элемента
							onClick={() => handleCategoryClick(category)}
						>
							{category.name}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default CategoryDropdown;