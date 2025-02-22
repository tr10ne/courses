import React, { useState, useEffect } from "react";

import Loading from "../Loading";
import DirectionItem from "./DirectionItem";
import { apiUrl } from "../../js/config";
import axios from "axios";

const NotFound = () => {
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState(null);
	const [expandedId, setExpandedId] = useState(null); // ID развернутого блока

	const handleToggle = (id) => {
		setExpandedId((prevId) => (prevId === id ? null : id)); // Разворачиваем/сворачиваем блок
	};

	useEffect(() => {
		axios
			.get(`${apiUrl}/api/categories`)
			.then((response) => {
				console.log("Ответ от API:", response.data);

				const result = Array.isArray(response.data)
					? response.data
					: response.data && Array.isArray(response.data.data)
					? response.data.data
					: null;

				if (Array.isArray(result)) {
					setCategories(result);
				} else {
					console.error("Ожидался массив, но получено:", response.data);
				}
				setLoading(false);
			})
			.catch((error) => {
				console.error("Ошибка при загрузке категорий:", error);
			});
	}, []);

	return (
		<section className="not-found">
			<div className="not-found__inner container">
				<svg className="not-found__svg" viewBox="0 0 70 70">
					<path d="M58.81.5H11.18C5.29.5.5 5.29.5 11.18v47.63c0 5.89 4.79 10.68 10.68 10.68h47.63c5.89 0 10.68-4.79 10.68-10.68V11.18C69.49 5.29 64.7.5 58.81.5Zm6.64 58.31a6.65 6.65 0 0 1-6.64 6.64H11.18a6.65 6.65 0 0 1-6.64-6.64V21.86h60.91v36.95Zm0-40.99H4.54v-6.64a6.65 6.65 0 0 1 6.64-6.64h47.63a6.65 6.65 0 0 1 6.64 6.64v6.64Z" />
					<path d="M11.18 0h47.63C64.98 0 70 5.01 70 11.18v47.63C70 64.98 64.98 70 58.81 70H11.18C5.01 70 0 64.98 0 58.81V11.18C0 5.01 5.01 0 11.18 0Zm47.63 64.94c3.38 0 6.13-2.75 6.13-6.13V22.37H5.05v36.44c0 3.38 2.75 6.13 6.13 6.13h47.63ZM5.05 17.31h59.89v-6.13c0-3.38-2.75-6.13-6.13-6.13H11.18c-3.38 0-6.13 2.75-6.13 6.13v6.13ZM11.18.5h47.63c5.89 0 10.68 4.79 10.68 10.68v47.63c0 5.89-4.79 10.68-10.68 10.68H11.18C5.29 69.49.5 64.7.5 58.81V11.18C.5 5.29 5.29.5 11.18.5Zm47.63 64.95a6.65 6.65 0 0 0 6.64-6.64V21.86H4.54v36.95a6.65 6.65 0 0 0 6.64 6.64h47.63Zm6.64-47.63v-6.64a6.65 6.65 0 0 0-6.64-6.64H11.18a6.65 6.65 0 0 0-6.64 6.64v6.64h60.91Z" />
					<path d="M13.35 9.16h-2.17c-2.67.1-2.68 3.94 0 4.04h2.17c2.68-.1 2.68-3.94 0-4.04Z" />
					<path d="M13.36 8.65h.01c3.33.13 3.32 4.94 0 5.06H11.16c-3.33-.12-3.33-4.93 0-5.06H13.36Zm-2.18 4.55c-2.68-.1-2.68-3.94 0-4.04h2.17c2.68.1 2.67 3.94 0 4.04h-2.17Z" />
					<path d="M23.09 9.16h-2.17c-2.67.1-2.67 3.94 0 4.04h2.17c2.68-.1 2.68-3.94 0-4.04Z" />
					<path d="M23.1 8.65h.01c3.33.13 3.32 4.94 0 5.06H20.91c-3.33-.12-3.33-4.93 0-5.06h2.19Zm-2.18 4.55c-2.67-.1-2.67-3.94 0-4.04h2.17c2.68.1 2.68 3.94 0 4.04h-2.17Z" />
					<path d="M32.83 9.16h-2.17c-2.67.1-2.67 3.94 0 4.04h2.17c2.68-.1 2.68-3.94 0-4.04Z" />
					<path d="M32.84 8.65h.01c3.33.13 3.33 4.94 0 5.06H30.65c-3.33-.12-3.33-4.93 0-5.06h2.19Zm-2.17 4.55c-2.68-.1-2.68-3.94 0-4.04h2.16c2.68.1 2.68 3.94 0 4.04h-2.16Z" />
					<path d="M33.18 43.59c1-1 2.63-1 3.63 0a2.022 2.022 0 1 0 2.86-2.86 6.615 6.615 0 0 0-9.35 0c-1.82 1.96.89 4.68 2.86 2.86Z" />
					<path d="M30.32 40.73a6.615 6.615 0 0 1 9.35 0 2.022 2.022 0 1 1-2.86 2.86c-1-1-2.63-1-3.63 0-1.97 1.82-4.68-.9-2.86-2.86Zm6.14 3.22c-.81-.81-2.12-.81-2.92 0l-.36-.36.34.37c-2.44 2.27-5.84-1.14-3.57-3.57v-.01l.01-.01a7.14 7.14 0 0 1 10.07 0c.99.99.99 2.59 0 3.58-.99.99-2.59.99-3.57 0Z" />
					<path d="M50.15 37.02c1.12 0 2.02-.91 2.02-2.02v-2.17c-.1-2.68-3.94-2.68-4.04 0V35c0 1.11.9 2.02 2.02 2.02Z" />
					<path d="M52.68 32.82V35a2.53 2.53 0 0 1-5.06 0v-2.19c.12-3.33 4.93-3.33 5.06 0v.01Zm-4.55.01c.1-2.68 3.94-2.68 4.04 0V35c0 1.11-.91 2.02-2.02 2.02A2.02 2.02 0 0 1 48.13 35v-2.17Z" />
					<path d="M19.84 37.02c1.12 0 2.02-.91 2.02-2.02v-2.17c-.1-2.68-3.94-2.68-4.04 0V35c0 1.11.91 2.02 2.02 2.02Z" />
					<path d="M22.37 32.82V35a2.53 2.53 0 0 1-5.06 0v-2.19c.13-3.33 4.94-3.33 5.06 0v.01Zm-4.55.01c.1-2.68 3.94-2.68 4.04 0V35c0 1.11-.9 2.02-2.02 2.02-1.11 0-2.02-.91-2.02-2.02v-2.17Z" />
				</svg>
				<h1 className="not-found__title">Страница не найдена</h1>
				<p className="not-found__text">
					Возможно она устрала, была удалена, или был введен неверный адрес в
					адресной строке
				</p>

				{loading ? (
					<Loading />
				) : (
					<div className="not-found__directions">
						{categories.map((category) => (
							<DirectionItem
								key={category.id}
								category={category}
								isExpanded={expandedId === category.id}
								onToggle={() => handleToggle(category.id)}
							/>
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default NotFound;
