import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import Breadcrumbs from "../Components/Breadcrumbs";
import Pagination from "../Components/Pagination";
import Loading from "../Components/Loading";
import { apiUrl } from "../js/config.js";
import CustomSelect from "../Components/SchoolReviews/CustomSelect";
import PageMetadata from "../Components/PageMetadata";
import { UserContext } from "../Components/UserContext.jsx";
import ReviewItemUserWrapper from "../Components/Reviews/ReviewItemUserWrapper.jsx";

const Reviews = () => {
	const { user, setUser } = useContext(UserContext);
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
	const [lastUpdateDate, setLastUpdateDate] = useState(null); // Состояние для хранения даты последнего обновления
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

					// Проверяем, что массив data не пустой
					if (data.length > 0) {
						setLastUpdateDate(
							new Date(data[0].created_at).toLocaleDateString()
						); // Устанавливаем дату последнего обновления
					} else {
						setLastUpdateDate("Нет данных"); // Или любое другое значение по умолчанию
					}

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
		fetchReviews();
	}, [queryParams.page, sortBy, activeTab, user]);

	const handlePageChange = (newPage) => {
		setQueryParams((prev) => ({ ...prev, page: newPage }));
		scrollTo(RefTarget);
	};

	const crumbs = [
		{ path: "/", name: "Главная" },
		{ path: "/reviews", name: "Отзывы" },
	];

	const handleSortChange = (field, order) => {
		setSortBy({ field, order });
		setQueryParams((prev) => ({ ...prev, page: 1 })); // Сбрасываем страницу на первую
	};

	const titleRef = useRef(null);
	const descriptionRef = useRef(null);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	useEffect(() => {
		if (titleRef.current) {
			setTitle(titleRef.current.textContent);
		}

		if (descriptionRef.current) {
			setDescription(descriptionRef.current.textContent);
		}
	}, []);

	const ReviewsTitle = `Все ${title.toLowerCase()} | COURSES`;
	const ReviewsDescription = `${description.split(".")[0].trim()}`;

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

	return (
		<>
			<PageMetadata title={ReviewsTitle} description={ReviewsDescription} />
			<div className="container">
				<section className="reviews">
					<div className="reviews__head block-head">
						<Breadcrumbs crumbs={crumbs} />
						<h1 ref={titleRef}>Отзывы о курсах и онлайн школах</h1>
						<p className="reviews__desc" ref={descriptionRef}>
							Отзывы об онлайн школах, курсах от учеников и выпускников.
						</p>

						<div className="reviews__box" ref={RefTarget}>
						{user?.role && (
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
					<div className="reviews__body">
						<div className="review-list">
							{loading ? (
								<Loading />
							) : reviews.length > 0 ? (
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
				</section>
			</div>
		</>
	);
};

export default Reviews;
