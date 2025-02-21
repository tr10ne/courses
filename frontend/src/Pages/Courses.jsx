import React, { useEffect, useState, useCallback, useRef, use } from "react";
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
import Arrows from "../Components/Courses/Arrows.jsx";

const Courses = () => {
	const recordsPerPage = 10; // Количество записей на странице
	const location = useLocation(); //// Хук для отслеживания изменений в URL
	const [error, setError] = useState(null);
	const [reloadSate, setRealoadState] = useState(false);
	const abortControllerRef = useRef(null);
	const [pagination, setPagination] = useState({
		current_page: 1,
		last_page: 1,
	});

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
	const [filter, setFilter] = useState("");
	const sidebarRef = useRef(null);

	//filter - price
	const [loadingPrice, setLoadingPrice] = useState(true);
	const [disabledPrise, setDisabledPrice] = useState(true);
	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);
	const [sliderValues, setSliderValues] = useState(["", ""]);
	const loadingDefautSliderValues = useRef(true);

	//filter - schools
	const [loadingSchools, setLoadingSchools] = useState(true);
	const [disabledSchools, setDisabledSchools] = useState(true);
	const [schools, setSchools] = useState([]);
	const [selectedSchools, setSelectedSchools] = useState([]);
	const [checkedSchoolSpans, setCheckedSchoolSpans] = useState({});
	const schoolsBlockRef = useRef(null);

	const [crumbs, setCrumbs] = useState([]);

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

	const fetchCourses = useCallback(() => {
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

		const searchParams = new URLSearchParams(location.search);
		const newFilter = searchParams.get("search") || ""; // Используем значение из URL напрямую

		setFilter(newFilter);

		const requestParams = {
			limit: recordsPerPage,
			page: pagination.current_page,
			filter: newFilter, // Передаем фильтр
			minPrice: sliderValues[0], // Используем значения из ползунка
			maxPrice: sliderValues[1],
			selectedSchools: selectedSchools.join(","), // Передаем выбранные школы
			sort_rating: ratingSort,
			sort_price: priceSort,
		};

		let request = params.categoryUrl ?? "";

		if (request && params.subcategoryUrl) {
			request += `/${params.subcategoryUrl}`;
		}

		axios
			.get(`${apiUrl}/api/courses/${request}`, {
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

				// Если данные курса есть, сохраняем их в состояние
				if (courses) {
					setCourses(courses);
					setSchools(response.data.schools);
					setTotalRecords(response.data.meta.total || 0); // Устанавливаем общее количество записей

					setSliderMin(parseFloat(response.data.min_total_price));
					setSliderMax(parseFloat(response.data.max_total_price));

					if (loadingDefautSliderValues.current) {
						setSliderValues([
							parseFloat(response.data.min_total_price),
							parseFloat(response.data.max_total_price),
						]);

						loadingDefautSliderValues.current = false;
					}

					setPagination(response.data.meta);
				} else {
					console.error("Ожидались курсы, но получено:", response.data);
					setError("Не удалось загрузить курсы.");
				}
				setLoadingCourses(false);
				setLoadingSchools(false);
				setLoadingPrice(false);
				setDisabledPrice(false);
				setDisabledSchools(false);
				setDisabledCategories(false);
			})
			.catch((error) => {
				if (error.name !== "CanceledError") {
					// Игнорируем ошибку отмены запроса
					console.error("Ошибка при загрузке курсов:", error);
					setError("Не удалось загрузить курсы. Пожалуйста, попробуйте позже.");
				}
			})
			.finally(() => {});
		// Очищаем AbortController при размонтировании или изменении зависимостей
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};

		//Если вы уверены, что sliderValues, sliderMin и sliderMax не должны вызывать пересоздание fetchCourses, можно отключить предупреждение с помощью комментария
		//  eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		pagination.current_page,
		params,
		location.search,
		reloadSate,
		selectedSchools,
		ratingSort,
		priceSort
	]);

	//чтобы избежать утечек памяти.
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	useEffect(() => {
		fetchCourses();
	}, [fetchCourses]);

	useEffect(() => {
		handleFilterReset();
	}, [params]);

	const handlePageChange = (newPage) => {
		setPagination((prev) => ({ ...prev, current_page: newPage }));

		scrollTo("courses");
	};

	// Обработчик изменения значений ползунка
	const handleSliderChange = (values) => {
		setSliderValues(values);
	};

	// Обработчик завершения перемещения ползунка
	const handleSliderAfterChange = (values) => {
		setSliderValues(values);
		setLoadingSchools(true);
		setDisabledPrice(true);
		setCheckedSchoolSpans({});
		if (selectedSchools.length !== 0) setSelectedSchools([]);
		else if (pagination.current_page !== 1) setDefaultPagination();
		else setRealoadState(!reloadSate);
	};

	//устанавливаем пагинации значения поумолчанию
	const setDefaultPagination = () => {
		setPagination({
			current_page: 1,
			last_page: 1,
		});
	};

	const scrollTo = (name) => {
		const headerHeight =
			document.documentElement.style.getPropertyValue("--header-height");
		scroller.scrollTo(name, {
			duration: 1000,
			smooth: true,
			offset: headerHeight * -1,
		});
	};

	const handleManualInputChange = (index, value) => {
		const newValue = parseFloat(value);
		if (isNaN(newValue)) return;

		const newValues = [...sliderValues];
		newValues[index] = newValue;

		// Проверка, чтобы значения не выходили за пределы диапазона
		if (index === 0 && newValue >= sliderValues[1]) return;
		if (index === 1 && newValue <= sliderValues[0]) return;

		handleSliderAfterChange(newValues);
	};

	//обработчик нажатия на категорию
	const handleCategoryChange = (category) => {
		loadingDefautSliderValues.current = true;
		setLoadingSchools(true);
		setLoadingPrice(true);
		setSelectedSchools([]);
		setSliderValues(["", ""]);
		setCheckedSchoolSpans({});
		// Если новая категория совпадает с текущей, сбрасываем выбор
		if (params.categoryUrl === category.url) {
			setSelectedCategory(null);
		}

		setSelectedSubcategory(null);

		setDefaultPagination();
	};

	//обработчик нажатия на подкатегорию
	const handleSubcategoryClick = (subcategory) => {
		setSelectedSubcategory(subcategory);
		loadingDefautSliderValues.current = true;
		setLoadingSchools(true);
		setLoadingPrice(true);
		setSelectedSchools([]);
		setSliderValues(["", ""]);
		setCheckedSchoolSpans({});
		setDefaultPagination();
		scrollTo("categories");
	};

	//обработчик нажатия на кнопку reset в фильтрах
	const handleFilterReset = () => {
		loadingDefautSliderValues.current = true;
		setSliderValues(sliderMin, sliderMax);
		setSelectedSchools([]);
		setCheckedSchoolSpans({});
		setLoadingSchools(true);
		setLoadingPrice(true);
		setDefaultPagination();
		schoolsBlockRef.current.classList.add("courses-filter__block_hide");
	};

	const handleSchoolCheckboxChange = (schoolId) => {
		setDisabledPrice(true);
		setDisabledSchools(true);
		setSelectedSchools((prev) => {
			if (prev.includes(schoolId)) {
				// Если школа уже выбрана, удаляем её из списка
				return prev.filter((id) => id !== schoolId);
			} else {
				// Если школа не выбрана, добавляем её в список
				return [...prev, schoolId];
			}
		});

		setCheckedSchoolSpans((prev) => ({
			...prev,
			[schoolId]: !prev[schoolId],
		}));
	};

	//нажатие на кнопку показать все школы
	const handleShowSchools = () => {
		schoolsBlockRef.current.classList.remove("courses-filter__block_hide");
	};

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


	const handleSortByRating = () => {
		setRatingSort(ratingSort === null ? 'true' : ratingSort === 'true' ? 'false' : null);
	};

	const handleSortByPrice = () => {
		setPriceSort(priceSort === null ? 'true' : priceSort === 'true' ? 'false' : null);
	};

	// отрисовываем курсы с пагинацией
	const renderCourses = () => {
		if (loadingCourses) return <Loading />;

		if (error) return <p>{error}</p>; // Показываем сообщение об ошибке

		return (
			<>
				{selectedSubcategory && (
					<p className="courses-subcategory">
						Курсы по ка тегории {selectedSubcategory.name}
					</p>
				)}
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
						disabledPrise={disabledPrise}
						sliderMin={sliderMin}
						sliderMax={sliderMax}
						sliderValues={sliderValues}
						handleSliderChange={handleSliderChange}
						handleSliderAfterChange={handleSliderAfterChange}
						handleManualInputChange={handleManualInputChange}
						schoolsBlockRef={schoolsBlockRef}
						loadingSchools={loadingSchools}
						schools={schools}
						disabledSchools={disabledSchools}
						selectedSchools={selectedSchools}
						handleSchoolCheckboxChange={handleSchoolCheckboxChange}
						checkedSchoolSpans={checkedSchoolSpans}
						handleShowSchools={handleShowSchools}
					/>
				</aside>
				<div className="courses-content">
					<div className="courses__titles courses-item_frame">
						<span>Курс</span>
						<span
							className="courses__titles__item"
							onClick={handleSortByRating}
						>
							Рейтинг <Arrows state={ratingSort}/>
						</span>
						<span className="courses__titles__item" onClick={handleSortByPrice}>
							Цена <Arrows state={priceSort} />
						</span>
						<span>Ссылка на курс</span>
					</div>
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
								schools={Array.isArray(schools) ? schools.slice(0, 2) : []}
							/>
						</>
					)}
				</div>
			</div>
		</section>
	);
};

export default Courses;
