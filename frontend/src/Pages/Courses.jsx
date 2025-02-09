import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "rc-slider/assets/index.css"; // Импортируем стили
import Categories from "../Components/Courses/Categories";
import Course from "../Components/Courses/Course";
import Filter from "../Components/Courses/Filter";
import Loading from "../Components/Loading";
import { apiUrl } from "../js/config.js";

const Courses = () => {
  const recordsPerPage = 20; // Количество записей на странице
  const location = useLocation(); //// Хук для отслеживания изменений в URL

	const [courses, setCourses] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalRecords, setTotalRecords] = useState(0);
	const [error, setError] = useState(null);
	const [loadingCourses, setLoadingCourses] = useState(true);
	const [loadingSchools, setLoadingSchools] = useState(true);
	const [loadingPrice, setLoadingPrice] = useState(true);
	const [disabledPrise, setDisabledPrice] = useState(true);
	const [disabledSchools, setDisabledSchools] = useState(true);
	const [disabledCategories, setDisabledCategories] = useState(true);

	const [selectedCategory, setSelectedCategory] = useState(null);
	const [filter, setFilter] = useState("");

  // Состояния для ползунка
  const [sliderMin, setSliderMin] = useState(0);
  const [sliderMax, setSliderMax] = useState(0);
  const [sliderValues, setSliderValues] = useState(["", ""]);

	//
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
		  .get(`${apiUrl}/api/courses`, {
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
		  })
		  .finally(() => {
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

	const renderCourses = () => {
		if (loadingCourses) return <Loading />;

		if (error) return <p>{error}</p>; // Показываем сообщение об ошибке

		return (
			<>
				<ul className="courses-list">
					{courses.map((course) => {
						return <Course key={course.course.id} course={course} />;
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

			<Categories
				selectedCategory={selectedCategory}
				handleCategoryChange={handleCategoryChange}
				disabledCategories={disabledCategories}
			/>

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

        <div className="courses-content">{renderCourses()}</div>
      </div>
    </>
  );
};

export default Courses;
