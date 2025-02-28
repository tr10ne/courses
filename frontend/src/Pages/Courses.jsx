import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "rc-slider/assets/index.css"; // Импортируем стили
import Categories from "../Components/Courses/Categories";
import CourseItem from "../Components/CourseDetail/CourseItem.jsx";
import Filter from "../Components/Courses/Filter";
import Loading from "../Components/Loading";
import { apiUrl } from "../js/config.js";
import Breadcrumbs from "../Components/Breadcrumbs.jsx";
import Pagination from "../Components/Pagination.jsx";
import Subcategories from "../Components/Courses/Subcategories.jsx";
import { scroller } from "react-scroll";
import Schools from "../Components/Courses/Schools.jsx";
import Arrows from "../Components/Arrows.jsx";
import { RequestHandler } from "../js/RequestHandler.js";

const Courses = () => {
	const recordsPerPage = 10; // Количество записей на странице
	const location = useLocation(); //// Хук для отслеживания изменений в URL
	const [error, setError] = useState(null);
	const abortControllerRef = useRef(null);
	const [pagination, setPagination] = useState({
		current_page: 1,
		last_page: 1,
	});

	//экземпляр запроса
	const requestHandlerRef = useRef(null);

	//courses
	const [courses, setCourses] = useState([]);
	const [loadingCourses, setLoadingCourses] = useState(true);
	const [priceSort, setPriceSort] = useState(null);
	const [ratingSort, setRatingSort] = useState(null);

	//categories
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedSubcategory, setSelectedSubcategory] = useState(null);
	const [disabledCategories, setDisabledCategories] = useState(true);
	const params = useParams();

	// filter
	const [totalRecords, setTotalRecords] = useState(0);
	const [disabledFilter, setDisabledFilter] = useState(true);
	const [filter, setFilter] = useState("");
	const sidebarRef = useRef(null);

	//filter - price
	const [loadingPrice, setLoadingPrice] = useState(true);
	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);
	const [sliderValues, setSliderValues] = useState(["", ""]);

	//filter - schools
	const [loadingSchools, setLoadingSchools] = useState(true);
	const [totalSchools, setTotalSchools] = useState([]);
	const [schools, setSchools] = useState([]);
	const [selectedSchoolsId, setSelectedSchoolsId] = useState([]);
	const [isHiddenSchools, setIsHiddenSchools] = useState(true);

	//хлебные крошки
	const [crumbs, setCrumbs] = useState([]);

	//=======================================================
	//ФУНКЦИИ

	//скроллиг к нужному элементу
	const scrollTo = (name) => {
		const headerHeight =
			document.documentElement.style.getPropertyValue("--header-height");
		scroller.scrollTo(name, {
			duration: 1000,
			smooth: true,
			offset: headerHeight * -1,
		});
	};

	//================================================================
	// РАБОТА С ЗАПРОСОМ

	//работа с данными для запроса
	useEffect(() => {
		if (!requestHandlerRef.current) {
			requestHandlerRef.current = new RequestHandler(
				location,
				pagination,
				sliderValues,
				selectedSchoolsId,
				ratingSort,
				priceSort,
				params,
				recordsPerPage
			);
		} else {
			requestHandlerRef.current.pagination = {
				current_page: 1,
			};
			requestHandlerRef.current.priceSort = null;
			requestHandlerRef.current.ratingSort = null;
			setPriceSort(null);
			setRatingSort(null);

			if (requestHandlerRef.current.location !== location) {
				requestHandlerRef.current.location = location;

				requestHandlerRef.current.sliderValues = [];
				requestHandlerRef.current.selectedSchoolsId = ["", ""];

				setSelectedSchoolsId([]);
				setSliderValues(["", ""]);
			}

			if (requestHandlerRef.current.params !== params) {
				requestHandlerRef.current.params = params;
				if (Object.keys(params).length === 0) {
					setSelectedCategory(null);
					setSelectedSubcategory(null);
				}
			}

			if (requestHandlerRef.current.recordsPerPage !== recordsPerPage) {
				requestHandlerRef.current.recordsPerPage = recordsPerPage;
			}
		}

		fetchCourses();

		//отключаем предупреждение с помощью комментария
		//  eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location, params, recordsPerPage]);

	useEffect(() => {
		if (!requestHandlerRef.current) return;

		if (requestHandlerRef.current.pagination !== pagination) {
			requestHandlerRef.current.pagination = pagination;
		}
	}, [pagination]);

	//Запрос для получения курсов
	const fetchCourses = (isRequestByFilter) => {
		// Отменяем предыдущий запрос, если он существует
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		// Создаем новый AbortController для текущего запроса
		const controller = new AbortController();
		abortControllerRef.current = controller;

		setLoadingCourses(true);
		setDisabledCategories(true);
		setTotalRecords(0);

		if (isRequestByFilter) {
			setDisabledFilter(true);
		} else {
			setLoadingPrice(true);
			setLoadingSchools(true);
		}

		const requestHandler = requestHandlerRef.current;

		const requestUrl = requestHandler.prepareRequestUrl();
		const requestParams = requestHandler.prepareRequestParams();
		setFilter(requestHandler.getSearchFilter());

		axios
			.get(`${apiUrl}/api/courses/${requestUrl}`, {
				params: requestParams,
				signal: controller.signal, // Передаем signal для отмены запроса
			})
			.then((response) => {
				console.log("Ответ от API:", response.data); // Проверьте структуру данных
				// Обрабатываем данные: если ответ — это объект с ключом 'courses' или просто массив
				const courses = Array.isArray(response.data)
					? response.data
					: response.data && Array.isArray(response.data.courses)
					? response.data.courses
					: null;

				if (courses) {
					setCourses(courses);
					setSchools(response.data.schools);
					setTotalRecords(response.data.meta.total || 0); // Устанавливаем общее количество записей

					if (!isRequestByFilter) {
						setTotalSchools(response.data.totalSchools);
						setSliderMin(parseFloat(response.data.min_total_price));
						setSliderMax(parseFloat(response.data.max_total_price));
						setSliderValues([
							parseFloat(response.data.min_total_price),
							parseFloat(response.data.max_total_price),
						]);
					}

					setPagination(response.data.meta);
				} else {
					console.error("Ожидались курсы, но получено:", response.data);
					setError("Не удалось загрузить курсы.");
				}

				setLoadingCourses(false);
				setLoadingSchools(false);
				setLoadingPrice(false);
				setDisabledFilter(false);
				setDisabledCategories(false);
			})
			.catch((error) => {
				if (error.name !== "CanceledError") {
					// Игнорируем ошибку отмены запроса
					console.error("Ошибка при загрузке курсов:", error);
					setError("Не удалось загрузить курсы. Пожалуйста, попробуйте позже.");
				}
				setLoadingCourses(false);
				setLoadingSchools(false);
				setLoadingPrice(false);
				setDisabledFilter(false);
				setDisabledCategories(false);
			});
		// Очищаем AbortController при размонтировании или изменении зависимостей
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	};

	//чтобы избежать утечек памяти
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	//================================================================
	//ХЛЕБНЫЕ КРОШКИ

	useEffect(() => {
		if (!courses) return;
		const crumbs = [
			{ path: "/", name: "Главная" },
			{ path: "/courses", name: "Онлайн-курсы" },
		];

		if (params && selectedCategory) {
			if (params.categoryUrl) {
				crumbs.push({
					path: `/courses/${params.categoryUrl}`,
					name: selectedCategory.name,
				});
			}
			if (params.subcategoryUrl && selectedSubcategory) {
				crumbs.push({
					path: `/courses/${params.categoryUrl}/${params.subcategoryUrl}`,
					name: selectedSubcategory.name,
				});
			}
		}

		setCrumbs(crumbs);
	}, [courses, params, selectedCategory, selectedSubcategory]);

	//=======================================================
	//ПАГИНАЦИЯ

	//клик по номеру страницы
	const handlePageChange = (newPage) => {
		setPagination((prev) => ({ ...prev, current_page: newPage }));
		requestHandlerRef.current.pagination = { current_page: newPage };
		scrollTo("courses");
		fetchCourses(true);
	};

	//=======================================================
	//РАБОТА С ФИЛЬТРАЦИЕЙ

	//делаем высоту для filter
	useEffect(() => {
		const handleFilterMaxHeight = () => {
			const filter = sidebarRef.current.querySelector(
				".courses-filter__content"
			);
			const INDENT = 20;
			const windowHeight = window.innerHeight;
			const headerHeight =
				document.documentElement.style.getPropertyValue("--header-height");
			const sidebarTop = sidebarRef.current.getBoundingClientRect().top;
			const filterTop = filter.getBoundingClientRect().top;

			const filterMaxHeight =
				windowHeight - headerHeight - INDENT * 2 - (filterTop - sidebarTop);

			filter.style.maxHeight = filterMaxHeight + "px";
		};

		if (!loadingCourses) handleFilterMaxHeight();

		window.addEventListener("resize", handleFilterMaxHeight);
		return () => {
			window.removeEventListener("resize", handleFilterMaxHeight);
		};
	}, [loadingCourses]);

	//обработчик нажатия на категорию
	const handleCategoryChange = (category) => {
		// Если новая категория совпадает с текущей, сбрасываем выбранную категорию
		if (params.categoryUrl === category.url) {
			setSelectedCategory(null);
		}
		setSelectedSubcategory(null);
		setPriceSort(null);
		setRatingSort(null);
	};

	//обработчик нажатия на подкатегорию
	const handleSubcategoryClick = (subcategory) => {
		setSelectedSubcategory(subcategory);
		scrollTo("categories");
	};

	// Обработчик нажатия на кнопку для фильтрации
	const handleFilterBtnClick = () => {
		requestHandlerRef.current.sliderValues = sliderValues;
		requestHandlerRef.current.selectedSchoolsId = selectedSchoolsId;
		requestHandlerRef.current.pagination = { current_page: 1 };

		scrollTo("courses");
		fetchCourses(true);
	};

	//обработчик нажатия на кнопку reset в фильтрах
	const handleFilterReset = () => {
		setIsHiddenSchools(true);
		scrollTo("courses");

		setSelectedSchoolsId([]);
		setSliderValues([sliderMin, sliderMax]);
		setRatingSort(null);
		setPriceSort(null);

		requestHandlerRef.current.sliderValues = ["", ""];
		requestHandlerRef.current.selectedSchoolsId = [];
		requestHandlerRef.current.pagination = { current_page: 1 };
		requestHandlerRef.current.ratingSort = null;
		requestHandlerRef.current.priceSort = null;

		fetchCourses(true);
	};

	//обработчик изменения поля ввода цены в фильтре
	const handleManualInputChange = (index, value) => {
		const newValue = parseFloat(value);
		if (isNaN(newValue)) return;

		const newValues = [...sliderValues];
		newValues[index] = newValue;

		// Проверка, чтобы значения не выходили за пределы диапазона
		if (index === 0 && newValue >= sliderValues[1]) return;
		if (index === 1 && newValue <= sliderValues[0]) return;

		setSliderValues(newValues);
	};

	//обработчик изменения выбранной школы
	const handleSchoolCheckboxChange = (schoolId) => {
		setSelectedSchoolsId((prev) => {
			if (prev.includes(schoolId)) {
				// Если школа уже выбрана, удаляем её из списка
				return prev.filter((id) => id !== schoolId);
			} else {
				// Если школа не выбрана, добавляем её в список
				return [...prev, schoolId];
			}
		});
	};



	// обработка cортировки
	const handleSort = (sortField, setSortField, requestHandlerField) => {
		const sort =
			sortField === null ? "true" : sortField === "true" ? "false" : null;

		setSortField(sort);
		requestHandlerRef.current[requestHandlerField] = sort;
		requestHandlerRef.current.pagination = { current_page: 1 };

		fetchCourses(true);
	};

	//сортировка по рейтинг
	const handleSortByRating = () => {
		handleSort(ratingSort, setRatingSort, "ratingSort");
	};

	//сортировка по цене
	const handleSortByPrice = () => {
		handleSort(priceSort, setPriceSort, "priceSort");
	};

	//=======================================================
	//ОТРИСОВКА ЭЛЕМЕНТОВ

	// отрисовываем курсы с пагинацией
	const renderCourses = () => {
		if (loadingCourses) return <Loading />;

		if (error) return <p>{error}</p>;

		return (
			<>
				{selectedSubcategory && (
					<p className="courses-subcategory">
						Курсы по ка тегории {selectedSubcategory.name}
					</p>
				)}
				<div className="courses__titles courses-item_frame">
					<span>Курс</span>
					<span className="courses__titles__item" onClick={handleSortByRating}>
						Рейтинг <Arrows state={ratingSort} />
					</span>
					<span className="courses__titles__item" onClick={handleSortByPrice}>
						Цена <Arrows state={priceSort} />
					</span>
					<span>Ссылка на курс</span>
				</div>
				<ul className="courses-list">
					{!courses || courses.length === 0 ? (
						<CourseItem foo={"Не найдено ни одно курса"} />
					) : (
						courses.map((course) => {
							return <CourseItem key={course.id} course={course} />;
						})
					)}
				</ul>
				<div>
					<Pagination
						currentPage={pagination.current_page}
						lastPage={pagination.last_page}
						onPageChange={handlePageChange}
					/>
				</div>
			</>
		);
	};

	return (
		<section className="courses section">
			<div className="container">
				<div className="block-head">
					<Breadcrumbs crumbs={crumbs} />
					<h1 className="title">Онлайн-курсы</h1>
					<p className="text">
						Список всех онлайн-курсов с рейтингом, отзывами и детальным
						описанием курса 2025 года. Для удобства поиска курса используйте
						фильтры, сортировку, сравнение и поиск. Мы обновляем информацию о
						всех курсах каждую неделю.
					</p>
				</div>
			</div>

			<Categories
				setSelectedCategory={setSelectedCategory}
				paramCategoryUrl={params.categoryUrl}
				handleCategoryChange={handleCategoryChange}
				disabledCategories={disabledCategories}
			/>

			<div className={`courses-main container`} name="courses">
				<aside className="courses-sidebar" ref={sidebarRef}>
					<p className="request-result-count ">
						{loadingCourses
							? "выполняется запрос..."
							: `По вашему запросу ${filter !== "" ? `"${filter}"` : ""} найдено
						${totalRecords} курсов`}
					</p>

					<Filter
						handleFilterReset={handleFilterReset}
						loadingPrice={loadingPrice}
						disabledFilter={disabledFilter}
						sliderMin={sliderMin}
						sliderMax={sliderMax}
						sliderValues={sliderValues}
						handleSliderChange={setSliderValues}
						handleSliderAfterChange={setSliderValues}
						handleManualInputChange={handleManualInputChange}
						setIsHiddenSchools={setIsHiddenSchools}
						isHiddenSchools={isHiddenSchools}
						loadingSchools={loadingSchools}
						schools={schools}
						totalSchools={totalSchools}
						selectedSchoolsId={selectedSchoolsId}
						handleSchoolCheckboxChange={handleSchoolCheckboxChange}
						handleFilterBtnClick={handleFilterBtnClick}
					/>
				</aside>
				<div className="courses-content">
					{renderCourses()}
					{selectedCategory && (
						<>
							<Subcategories
								selectedCategory={selectedCategory}
								loadingCourses={loadingCourses}
								handleSubcategoryClick={handleSubcategoryClick}
								paramSubcategoryUrl={params.subcategoryUrl}
								setSelectedSubcategory={setSelectedSubcategory}
							/>
							<Schools
								selectedCategoryName={selectedCategory.name}
								loadingCourses={loadingCourses}
								schools={
									Array.isArray(totalSchools) ? totalSchools.slice(0, 2) : []
								}
							/>
						</>
					)}
				</div>
			</div>
		</section>
	);
};

export default Courses;
