import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import Pagination from "../Components/Pagination";
import Loading from "../Components/Loading";
import { apiUrl } from "../js/config.js";
import CustomSelect from "../Components/SchoolReviews/CustomSelect";
import { UserContext } from "../Components/UserContext.jsx";
import ReviewItemUserWrapper from "../Components/Reviews/ReviewItemUserWrapper.jsx";
import ItemsDropdown from "../Components/ItemsDropdown.jsx";

const Reviews = () => {
	const { user } = useContext(UserContext);
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({
		current_page: 1,
		last_page: 1,
	});
	const [queryParams, setQueryParams] = useState({
		page: 1,
	});
	const [sortBy, setSortBy] = useState({
		field: "date", // Поле для сортировки (date или rating)
		order: "desc", // Порядок сортировки (asc или desc)
	});
	const RefTarget = useRef(null);
	const [activeTab, setActiveTab] = useState("pending"); // По умолчанию "pending"
	const tabs = [
		{ id: "pending", label: "На модерации" },
		{ id: "approved", label: "Одобренные" },
		{ id: "rejected", label: "Отклоненные" },
	];

	const scrollTo = (ref) => {
		const headerHeight = parseInt(
			getComputedStyle(document.documentElement).getPropertyValue(
				"--header-height"
			),
			15
		);
		const targetPosition = ref.current.offsetTop - headerHeight;
		window.scrollTo({
			top: targetPosition,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		const fetchReviews = async () => {
			setLoading(true);
			try {
				const params = {
					page: queryParams.page,
					sort_by: sortBy.field,
					sort_order: sortBy.order,
				};

				// Если пользователь — модератор, добавляем статус
				if (user?.role === "moderator") {
					params.status = activeTab;
				}

				// Если пользователь — обычный пользователь, добавляем user_id
				if (user?.role === "user") {
					params.user_id = user.id;
					params.status = activeTab;
				}

				const reviews = await axios.get(`${apiUrl}/api/reviews`, { params });

				if (reviews.data) {
					const data = reviews.data.data || [];
					setReviews(data);

					setPagination({
						current_page: reviews.data.meta.current_page || 1,
						last_page: reviews.data.meta.last_page || 1,
					});
				}
				setLoading(false);
			} catch (error) {
				console.error("Ошибка при загрузке данных:", error);
				setLoading(false);
			}
		};

		if (user) fetchReviews();
	}, [queryParams.page, sortBy, activeTab, user]);

	const handlePageChange = (newPage) => {
		setQueryParams((prev) => ({ ...prev, page: newPage }));
		scrollTo(RefTarget);
	};

	const handleSortChange = (field, order) => {
		setSortBy({ field, order });
		setQueryParams((prev) => ({ ...prev, page: 1 })); // Сбрасываем страницу на первую
	};

	// Callback для удаления отзыва
	const handleDelete = (reviewId) => {
		setReviews((prevReviews) => prevReviews.filter((r) => r.id !== reviewId));
	};

	// Callback для одобрения/отклонения отзыва
	const handleModerate = (reviewId, action) => {
		setReviews((prevReviews) => prevReviews.filter((r) => r.id !== reviewId));
	};

	const handleUpdate = () => {
		// Перезагрузить отзывы или обновить состояние
		console.log("Отзыв обновлен");
	};

	// Обработчик выбора вкладки через Dropdown
	const handleTabSelect = (tab) => {
		setActiveTab(tab.id);
	};

	// Фильтруем вкладки для пользователя
	const filteredTabs = tabs.filter((tab) => {
		if (user?.role === "user" && tab.id === "rejected") return false;
		return true;
	});

	return (
		<>
			<div className="container">
				<section className="reviews reviews_user">
					<div className="reviews__head block-head">
						{" "}
						<h1 className="title ">
							Отзывы о курсах и онлайн школах
						</h1>
						<div className="reviews__box" ref={RefTarget}>
							{user?.role && (
								<>
									<ItemsDropdown
										items={filteredTabs}
										onSelect={handleTabSelect}
										selectedItem={tabs.find((tab) => tab.id === activeTab)}
										placeholder="Выберите вкладку"
										displayKey="label"
										idKey="id"
									/>
									<div className="reviews__tabs">
										{tabs.map((tab) => {
											if (user.role === "user" && tab.id === "rejected")
												return null;

											return (
												<button
													key={tab.id}
													className={`reviews__tab ${
														activeTab === tab.id ? "active" : ""
													}`}
													onClick={() => setActiveTab(tab.id)}
												>
													{tab.label}
												</button>
											);
										})}
									</div>
								</>
							)}
							<div className="reviews__sort">
								<p>Сортировка: </p>
								<CustomSelect
									options={[
										{ value: "date_desc", label: "Сначала новые" },
										{ value: "date_asc", label: "Сначала старые" },
										{ value: "rating_desc", label: "Сначала положительные" },
										{ value: "rating_asc", label: "Сначала отрицательные" },
									]}
									value={`${sortBy.field}_${sortBy.order}`}
									onChange={(value) => {
										const [field, order] = value.split("_");
										handleSortChange(field, order);
									}}
								/>
							</div>
						</div>
					</div>

					{loading ? (
						<Loading />
					) : (
						<div className="reviews__body">
							<div className="review-list">
								{reviews.length > 0 ? (
									reviews.map((review) => (
										<ReviewItemUserWrapper
											key={review.id}
											review={review}
											onDelete={handleDelete}
											onUpdate={handleUpdate}
											onModerate={handleModerate}
										/>
									))
								) : (
									<p>Отзывов пока нет</p>
								)}
							</div>
							<div className="reviews__footer">
								<Pagination
									currentPage={pagination.current_page}
									lastPage={pagination.last_page}
									onPageChange={handlePageChange}
								/>
							</div>
						</div>
					)}
				</section>
			</div>
		</>
	);
};

export default Reviews;
