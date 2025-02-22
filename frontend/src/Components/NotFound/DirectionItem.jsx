import React, { useState } from "react";
import { Link } from "react-router-dom";

const DirectionItem = ({ category, isExpanded, onToggle }) => {
	const displayedSubcategories = isExpanded
		? category.subcategories
		: category.subcategories.slice(0, 4);

	return (
		<div
			className="direction-item"
			style={{ gridRowEnd: isExpanded ? "span 3" : "auto" }}
		>
			<h2 className="direction-item__title">{category.name}</h2>
			<ul className="direction-item__subcategory-list">
				{displayedSubcategories.map((subcategory, index) => (
					<li className="direction-item__subcategory-item " key={index}>
						<Link
							className="direction-item__subcategory-link"
							to={`/courses/${category.url}/${subcategory.url}`}
						>
							{subcategory.name}
						</Link>
					</li>
				))}
			</ul>
			{category.subcategories.length > 4 && (
				<button onClick={onToggle} className="toggle-button">
					{isExpanded ? "Свернуть все" : "Развернуть все"}

					<svg
						className="toggle-icon"
						viewBox="0 0 10 5.7"
						style={{
							transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
						}}
					>
						<path d="M5 5.7c-.18 0-.36-.07-.5-.21L.2 1.19A.706.706 0 0 1 .2.2c.27-.27.72-.27.99 0L5 4 8.8.2c.27-.27.72-.27.99 0s.27.72 0 .99l-4.3 4.3A.7.7 0 0 1 5 5.7Z" />
					</svg>
				</button>
			)}
		</div>
	);
};

export default DirectionItem;
