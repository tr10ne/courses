import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ crumbs }) => {
	return (
		<nav className="breadcrumbs">
			{crumbs.map((crumb, index) => (
				<span key={index}>
					{index > 0 && (
						<span className="separator"> - </span> // Добавляем разделитель
					)}
					{index < crumbs.length - 1 ? ( // Если это не последний элемент
						<Link to={crumb.path} className="crumb-link">
							{crumb.name}
						</Link>
					) : (
						<span className="crumb-current">{crumb.name}</span> // Последний элемент (текущая страница)
					)}
				</span>
			))}
		</nav>
	);
};

export default Breadcrumbs;
