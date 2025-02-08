import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
// import Slider from "react-slider"; // Импортируем react-slider
// import "react-slider/slnpm install react-sliderider.css"; // Импортируем стили для ползунка
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // Импортируем стили

const Courses = () => {
	const recordsPerPage = 20; // Количество записей на странице
	const location = useLocation(); //// Хук для отслеживания изменений в URL

	const [courses, setCourses] = useState([]);
	const [currentPage, setCurrentPage] = useState(1); // Состояние для отслеживания текущей страницы
	const [totalRecords, setTotalRecords] = useState(0); // Общее количество записей
	const [error, setError] = useState(null); // Состояние для ошибок

	const [loadingCourses, setLoadingCourses] = useState(true); // Состояние для отслеживания загрузки
	const [loadingCategories, setLoadingCategories] = useState(true); // Состояние для отслеживания загрузки
	const [loadingSchools, setLoadingSchools] = useState(true); // Состояние для отслеживания загрузки
	const [loadingPrice, setLoadingPrice] = useState(true); // Состояние для отслеживания загрузки
	const [disabledPrise, setDisabledPrice] = useState(true); // Состояние для отслеживания загрузки
	const [disabledSchools, setDisabledSchools] = useState(true); // Состояние для отслеживания загрузки
	const [disabledCategories, setDisabledCategories] = useState(true); // Состояние для отслеживания загрузки

	const [selectedCategory, setSelectedCategory] = useState(null); // Состояние для выбранной категории
	const [categories, setCategories] = useState([]);
	const [filter, setFilter] = useState("");

	// Состояния для ползунка
	const [sliderMin, setSliderMin] = useState(0);
	const [sliderMax, setSliderMax] = useState(0);
	const [sliderValues, setSliderValues] = useState(["", ""]);


	const [schools, setSchools] = useState([]);
	const [selectedSchools, setSelectedSchools] = useState([]);
	const [checkedSchoolSpans, setCheckedSchoolSpans] = useState({});
	const schoolsBlockRef = useRef(null);

	const [reloadSate, setRealoadState] = useState(false);
	const abortControllerRef = useRef(null);
	const loadingDefautSliderValues = useRef(true);

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

		const params = {
			limit: recordsPerPage,
			offset: (currentPage - 1) * recordsPerPage,
			selectedCategory: selectedCategory,
			filter: newFilter, // Передаем фильтр
			minPrice: sliderValues[0], // Используем значения из ползунка
			maxPrice: sliderValues[1],
			selectedSchools: selectedSchools.join(","), // Передаем выбранные школы
		};

		axios
			.get("http://127.0.0.1:8000/api/courses", {
				params,
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
				console.log("message");

				// Если данные курса есть, сохраняем их в состояние
				if (courses) {
					setCourses(courses);
					setSchools(response.data.schools);
					setTotalRecords(response.data.total || 0); // Устанавливаем общее количество записей

					setSliderMin(parseFloat(response.data.min_total_price));
					setSliderMax(parseFloat(response.data.max_total_price));

					if (loadingDefautSliderValues.current) {
						setSliderValues([
							parseFloat(response.data.min_total_price),
							parseFloat(response.data.max_total_price),
						]);

						loadingDefautSliderValues.current = false;
					}
				} else {
					console.error("Ожидались курсы, но получено:", response.data);
					setError("Не удалось загрузить курсы.");
				}

			})
			.catch((error) => {
        if (error.name !== "CanceledError") {
          // Игнорируем ошибку отмены запроса
					console.error("Ошибка при загрузке курсов:", error);
					setError("Не удалось загрузить курсы. Пожалуйста, попробуйте позже.");

				}
			}).finally(()=>{
        setLoadingCourses(false);
					setLoadingSchools(false);
					setLoadingPrice(false);
       setDisabledPrice(false);
          setDisabledSchools(false);
          setDisabledCategories(false);
      });
		// Очищаем AbortController при размонтировании или изменении зависимостей
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};

		//Если вы уверены, что sliderValues, sliderMin и sliderMax не должны вызывать пересоздание fetchCourses, можно отключить предупреждение с помощью комментария
		//  eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		currentPage,
		selectedCategory,
		location.search,
		reloadSate,
		selectedSchools,
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
		else if (currentPage !== 1)
			setCurrentPage(1); // Сбрасываем на первую страницу
		else setRealoadState(!reloadSate);
	};

	useEffect(() => {
		setCurrentPage(1); // Сбрасываем на первую страницу при изменении поискового запроса
	}, [location.search]);

	useEffect(() => {

		axios
			.get("http://127.0.0.1:8000/api/categories")
			.then((response) => {
				console.log("Ответ от API:", response.data); // Проверьте структуру данных

				// Если данные — это массив напрямую или массив внутри объекта с ключом 'data'
				const result = Array.isArray(response.data)
					? response.data
					: response.data && Array.isArray(response.data.data)
					? response.data.data
					: null;

				// Если это массив, сохраняем в состояние
				if (Array.isArray(result)) {
					setCategories(result);
				} else {
					console.error("Ожидался массив, но получено:", response.data);
				}

			})
			.catch((error) => {
				console.error("Ошибка при загрузке категорий:", error);

			}
    ).finally(()=>{
      setLoadingCategories(false);
    });
	}, []);

	const renderCourses = () => {
		if (loadingCourses) return <p>Загрузка...</p>;

		if (error) return <p>{error}</p>; // Показываем сообщение об ошибке

		return (
			<>
				<ul className="courses-list">
					{courses.map((course) => {
						return (
							<li className="courses-item courses-grid" key={course.course.id}>
									<Link to={`/courses/${course.course.url}`}>
										{course.course.name}
									</Link>

								<div className="courses-item__rating">
									<p>Количество отзывов: {course.review_count}</p>
									<p>
										Rating:{" "}
										{course.course_rating == null
											? "пока еще нет отзывов"
											: course.course_rating}
									</p>
								</div>

									<p>Price: {course.course.price}</p>

                  <p>
										Школа: {course.school ? course.school.name : "Не указана"}
									</p>

                <div className="courses-item__controls">
									<Link className="courses-item__site" to={course.course.link}>
										На сайт курса
									</Link>
									<Link className="courses-item__site" to={course.course.link}>
										Подробнее
									</Link>
								</div>
							</li>
						);
					})}
				</ul>
				<div>
					<button
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}
					>
						Назад
					</button>
					{Array.from(
						{ length: Math.ceil(totalRecords / recordsPerPage) },
						(_, i) => (
							<button
								key={i}
								onClick={() => setCurrentPage(i + 1)}
								disabled={currentPage === i + 1} // Деактивируем кнопку для текущей страницы
							>
								{i + 1}
							</button>
						)
					)}
					<button
						onClick={() => setCurrentPage((prev) => prev + 1)}
						disabled={currentPage === Math.ceil(totalRecords / recordsPerPage)}
					>
						Вперед
					</button>
				</div>
			</>
		);
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

	const renderCategories = () => {
		const handleCategoryChange = (e) => {
			loadingDefautSliderValues.current = true;
			setLoadingSchools(true);
			setLoadingPrice(true);
			setSelectedSchools([]);
			setSliderValues(["", ""]);
      setCheckedSchoolSpans({});
			const newCategory = e.target.value;

			// Если новая категория совпадает с текущей, сбрасываем выбор
			if (selectedCategory === newCategory) {
				setSelectedCategory(null);
			} else {
				setSelectedCategory(newCategory);
			}
			setCurrentPage(1);
		};

		return (
			<>
				{categories.map((category) => (
					<label
						className={`categories-filter__lbl ${
							selectedCategory === category.id.toString() ? "checked" : ""
						}`}
						key={category.id}
					>
						{category.name}
						<input
							className="categories-filter__radio"
							type="radio"
							name="categories-filter-radio"
							value={category.id}
							onChange={handleCategoryChange}
							onClick={handleCategoryChange}
							checked={selectedCategory === category.id.toString()} // Устанавливаем checked, если категория выбрана
						/>
					</label>
				))}
			</>
		);
	};

	const renderSchoolCheckboxes = () => {
		return schools.map((school) => (
			<label className="schools-filter__lbl" key={school.id}>
				{school.name}
				<input
					className="schools-filter__checkbox"
					type="checkbox"
					checked={selectedSchools.includes(school.id)}
					onChange={() => handleSchoolCheckboxChange(school.id)}
				/>
				<span
					className={`schools-filter__lbl__span ${
						checkedSchoolSpans[school.id] ? "checked" : ""
					}`}
				></span>
			</label>
		));
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

	const handleFilterReset = () => {
		loadingDefautSliderValues.current = true;
		setSliderValues(sliderMin, sliderMax);
		setSelectedSchools([]);
		setSelectedCategory(null);
		setCheckedSchoolSpans({});
    setLoadingSchools(true);
    setLoadingPrice(true);

		schoolsBlockRef.current.classList.add("courses-filter__block_hide");
	};

	const handleShowSchools = () => {
		schoolsBlockRef.current.classList.remove("courses-filter__block_hide");
	};

	return (
		<>
			<div className="block-intro">
				<div className="container">
					<h1 className="title">Онлайн-курсы</h1>
					<p className="text">
						Список всех онлайн-курсов с рейтингом, отзывами и детальным
						описанием курса 2025 года. Для удобства поиска курса используйте
						фильтры, сортировку, сравнение и поиск. Мы обновляем информацию о
						всех курсах каждую неделю.
					</p>
				</div>
			</div>

			<div className="categories-filter">

				<div className={`categories-filter__inner container ${disabledCategories?'disabled':''}`}>

					{loadingCategories? <p>загрузка...</p> : renderCategories()}
				</div>
			</div>

			<div className="courses-main container">
				<p className="request-result-count">
					{loadingCourses
						? "выполняется запрос..."
						: `По вашему запросу ${filter !== "" ? `"${filter}"` : ""} найдено
						${totalRecords} курсов`}
				</p>
				<div className="column-title courses-grid">
					<div className="column-title__item">
						<span className="column-title__text">Курс</span>
					</div>
					<div className="column-title__item">
						<span className="column-title__text">Рейтинг</span>
					</div>
					<div className="column-title__item">
						<span className="column-title__text">Цена</span>
					</div>
					<div className="column-title__item">
						<span className="column-title__text">Школа</span>
					</div>
					<div className="column-title__item">
						<span className="column-title__text">Ссылка на курс</span>
					</div>
				</div>
				<div className="courses-filter">
					<span className="courses-filter__header">
						{" "}
						Фильтры{" "}
						<button
							className="courses-filter__reset-btn"
							onClick={handleFilterReset}
						>
							{" "}
							<svg viewBox="0 0 18.125 16.25">
								<path d="M12.81 2.81h-1.45l1.21-1.21c.09-.09.16-.19.21-.31.04-.11.07-.23.07-.36 0-.12-.03-.24-.07-.36-.05-.11-.12-.21-.21-.3a.922.922 0 0 0-.66-.27c-.12 0-.25.02-.36.07-.11.04-.22.11-.3.2L8.43 3.08c-.08.09-.15.19-.2.31-.05.11-.07.23-.07.36 0 .12.02.24.07.35.05.12.12.22.2.31l2.82 2.81c.17.18.41.28.66.28.25 0 .49-.1.66-.28.18-.18.28-.41.28-.66 0-.25-.1-.49-.28-.67l-1.21-1.21h1.45c.91 0 1.78.36 2.43 1.01.64.64 1.01 1.52 1.01 2.43 0 .91-.37 1.79-1.01 2.43-.65.65-1.52 1.01-2.43 1.01-.25 0-.49.1-.67.27a.98.98 0 0 0-.27.67c0 .24.1.48.27.66.18.17.42.27.67.27 2.93 0 5.31-2.38 5.31-5.31 0-2.93-2.38-5.31-5.31-5.31ZM6.91 9.02a.93.93 0 0 0-.66-.27c-.25 0-.49.09-.67.27a.956.956 0 0 0-.2 1.02c.05.12.12.22.2.31l1.21 1.21H5.31c-.91 0-1.79-.36-2.43-1.01a3.412 3.412 0 0 1-1.01-2.43c0-.91.36-1.79 1.01-2.43.64-.65 1.52-1.01 2.43-1.01a.941.941 0 0 0 .94-.93c0-.25-.1-.49-.28-.67a.956.956 0 0 0-.66-.27C2.38 2.81 0 5.19 0 8.12c0 2.93 2.38 5.31 5.31 5.31h1.48l-1.21 1.21a.98.98 0 0 0-.27.67c0 .25.1.48.27.66.18.18.42.28.67.28.24 0 .48-.1.66-.28l2.81-2.81a.79.79 0 0 0 .2-.31c.05-.11.08-.23.08-.35 0-.13-.03-.25-.08-.36a.79.79 0 0 0-.2-.31L6.91 9.02Z" />
							</svg>
						</button>{" "}
					</span>

					<div className="courses-filter__content ">
						<div className="courses-filter__block">
							<span className="courses-filter__content__title">Цена</span>
							{loadingPrice ? (
								<p>Загрузка...</p>
							) : (
								<div className={`courses-filter__content__price ${disabledPrise?'disabled':''}`}>
									<Slider
										id={"price-filter__slider"}
										range
										min={sliderMin}
										max={sliderMax}
										value={sliderValues}
										onChange={handleSliderChange}
										onChangeComplete={handleSliderAfterChange}
										className="rc-slider"
									/>
									<div className="slider-labels">
										<input
											type="number"
											value={sliderValues[0] || 0} // Проверка на undefined или null
											onChange={(e) =>
												handleManualInputChange(0, e.target.value)
											}
											min={sliderMin}
											max={sliderValues[1]}
											style={{ marginRight: "10px" }}
										/>
										<input
											type="number"
											value={sliderValues[1] || 0} // Проверка на undefined или null
											onChange={(e) =>
												handleManualInputChange(1, e.target.value)
											}
											min={sliderValues[0]}
											max={sliderMax}
										/>
									</div>
								</div>
							)}
						</div>

						<div
							ref={schoolsBlockRef}
							className={`courses-filter__block ${
								schools.length > 5 ? "courses-filter__block_hide" : ""
							}`}
						>
							<span className="courses-filter__content__title">Школы:</span>

              {loadingSchools ? <p>Загрузка</p>:<>
							<div className={`schools-filter  ${ disabledSchools?'disabled':''}`}>{renderSchoolCheckboxes()}</div>

							<button
								className={`show-schools-btn ${
									schools.length > 5 ? "" : "hide"
								} ${ disabledSchools?'disabled':''}`}
								onClick={handleShowSchools}
							>
								Показать все школы ({schools.length - 5})
							</button>
              </>}
						</div>
					</div>
				</div>

				<div className="courses-content">{renderCourses()}</div>
			</div>
		</>
	);
};

export default Courses;
