import React from "react";

const Pagination = ({
	totalRecords,
	recordsPerPage,
	currentPage,
	setCurrentPage,
}) => {
	const totalPages = Math.ceil(totalRecords / recordsPerPage);

	const getPageNumbers = () => {
		const pages = [];
		if (totalPages <= 6) {
			// Если страниц меньше или равно 7, показываем все
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= 3) {
				// Показываем первые 5 страниц, затем многоточие и последнюю
				for (let i = 1; i <= 4; i++) {
					pages.push(i);
				}
				pages.push("...");
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				// Показываем первую страницу, многоточие и последние 5 страниц
				pages.push(1);
				pages.push("...");
				for (let i = totalPages - 3; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				// Показываем первую страницу, многоточие, текущую и две соседние, затем многоточие и последнюю
				pages.push(1);
				pages.push("...");
				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					pages.push(i);
				}
				pages.push("...");
				pages.push(totalPages);
			}
		}
		return pages;
	};

	return (
		<div className="pagination">
			{getPageNumbers().map((page, index) =>
				page === "..." ? (
					<span key={index} className="dots">
						{page}
					</span>
				) : (
					<button
						className={`page-button ${currentPage === page ? "active" : ""}`}
						key={index}
						onClick={() => setCurrentPage(page)}
					>
						{page}
					</button>
				)
			)}
		</div>
	);
};

export default Pagination;
