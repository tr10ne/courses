import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useLayoutEffect,
} from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../Components/Breadcrumbs";
import Pagination from "../Components/Pagination";
import { apiUrl } from "../js/config.js";
import CourseItem from "../Components/CourseDetail/CourseItem";
import SubcategoryFilter from "../Components/SchoolDetail/SubcategoryFilter";
import MobileFilterWrapper from "../Components/MobileFilterWrapper";
import MobileFilterButton from "../Components/MobileFilterButton";
import AvgRatingStar from "../Components/AvgRatingStar";
import Loading from "../Components/Loading";
import PageMetadata from "../Components/PageMetadata";

const SchoolDetail = () => {
  const navigate = useNavigate();
  const { url } = useParams();
  const [school, setSchool] = useState(null);
  const [courses, setCourses] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [sliderValues, setSliderValues] = useState(null);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [initialData, setInitialData] = useState(null); // Храним все начальные данные вместе

  const [queryParams, setQueryParams] = useState({
    page: 1,
    schoolurl: url,
    selectedSubcategories: [],
    minPrice: "",
    maxPrice: "",
  });

  const RefTarget = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const calculateHeight = () => {
      if (windowWidth >= 1024 && bodyRef.current) {
        const filterElement = document.querySelector(".subcategory-filter");
        if (filterElement) {
          const bodyHeight = bodyRef.current.offsetHeight;
          filterElement.style.maxHeight = `${bodyHeight}px`;
        }
      }
    };
    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, [windowWidth, courses]);

  const scrollTo = useCallback((ref) => {
    const headerHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--header-height"
      ),
      12
    );
    window.scrollTo({
      top: ref.current.offsetTop - headerHeight,
      behavior: "smooth",
    });
  }, []);

  const toggleFilter = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [schoolResponse, coursesResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/schools/url/${url}`),
          axios.get(`${apiUrl}/api/courses?schoolurl=${url}&limit=all`),
        ]);

        const schoolData = schoolResponse.data?.data || schoolResponse.data;
        if (!schoolData) {
          setError("Школа не найдена");
          return;
        }

        const coursesData = coursesResponse.data.courses || [];
        const uniqueSubcategories = Array.from(
          new Set(coursesData.map((course) => course.subcategory_name))
        ).map((name) => ({
          id: coursesData.find((course) => course.subcategory_name === name)
            .subcategory_id,
          name,
        }));

        let minPrice = "";
        let maxPrice = "";
        let sliderVals = null;
        if (
          coursesResponse.data.min_total_price &&
          coursesResponse.data.max_total_price
        ) {
          minPrice = coursesResponse.data.min_total_price;
          maxPrice = coursesResponse.data.max_total_price;
          sliderVals = [minPrice, maxPrice];
          setPriceRange([minPrice, maxPrice]);
        }

        // Обновляем все состояния разом через один setInitialData
        setInitialData({
          school: schoolData,
          allSubcategories: uniqueSubcategories,
          filteredSubcategories: uniqueSubcategories,
          sliderValues: sliderVals,
          queryParams: {
            page: 1,
            schoolurl: url,
            selectedSubcategories: [],
            minPrice,
            maxPrice,
          },
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          navigate("/404");
        }
        setError("Ошибка при загрузке данных школы");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [url, navigate]);

  // Синхронизация состояний после установки initialData
  useEffect(() => {
    if (initialData) {
      setSchool(initialData.school);
      setAllSubcategories(initialData.allSubcategories);
      setFilteredSubcategories(initialData.filteredSubcategories);
      setSliderValues(initialData.sliderValues);
      setQueryParams(initialData.queryParams);
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCourses = async () => {
      setCoursesLoading(true);
      const subcategoriesQuery =
        queryParams.selectedSubcategories.length > 0
          ? `&selectedSubcategoryId=${queryParams.selectedSubcategories.join(
              ","
            )}`
          : "";
      const priceQuery = `&minPrice=${queryParams.minPrice}&maxPrice=${queryParams.maxPrice}`;
      try {
        const response = await axios.get(
          `${apiUrl}/api/courses?schoolurl=${url}&page=${queryParams.page}${subcategoriesQuery}${priceQuery}`
        );
        const data = response.data;
        setCourses(data.courses || []);
        setPagination({
          current_page: data.meta.current_page,
          last_page: data.meta.last_page,
        });
      } catch (error) {
        setError("Ошибка при загрузке курсов");
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, [
    queryParams.page,
    queryParams.selectedSubcategories,
    queryParams.minPrice,
    queryParams.maxPrice,
    url,
  ]);

  const [isFilterReady, setIsFilterReady] = useState(false);

  useLayoutEffect(() => {
    const calculateHeight = () => {
      const filterElement = document.querySelector(".subcategory-filter");
      if (filterElement) {
        const isMobile = window.innerWidth < 1024;
        if (isMobile) {
          filterElement.style.maxHeight = `${window.innerHeight}px`;
        } else if (bodyRef.current) {
          const bodyHeight = bodyRef.current.offsetHeight;
          filterElement.style.maxHeight = `${bodyHeight}px`;
        }
      }
    };
    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, [courses, isFilterReady]);

  useEffect(() => {
    if (!school) return;
    const fetchFilteredSubcategories = async () => {
      setSubcategoriesLoading(true);
      try {
        const response = await axios.get(
          `${apiUrl}/api/courses?schoolurl=${url}&limit=all&minPrice=${queryParams.minPrice}&maxPrice=${queryParams.maxPrice}`
        );
        const coursesData = response.data.courses || [];
        const uniqueSubcategories = Array.from(
          new Set(coursesData.map((course) => course.subcategory_name))
        ).map((name) => ({
          id: coursesData.find((course) => course.subcategory_name === name)
            .subcategory_id,
          name,
        }));
        setFilteredSubcategories(uniqueSubcategories);
      } catch (error) {
        setError("Ошибка при загрузке подкатегорий");
      } finally {
        setSubcategoriesLoading(false);
      }
    };
    fetchFilteredSubcategories();
  }, [queryParams.minPrice, queryParams.maxPrice, url, school]);

  const handleResetFilters = useCallback(() => {
    setQueryParams((prev) => ({
      ...prev,
      selectedSubcategories: [],
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      page: 1,
    }));
    setSliderValues([priceRange[0], priceRange[1]]);
    setFilteredSubcategories(allSubcategories);
  }, [priceRange, allSubcategories]);

  const handleSubcategoryChange = useCallback((selectedSubcategories) => {
    setQueryParams((prev) => ({
      ...prev,
      selectedSubcategories,
      page: 1,
    }));
  }, []);

  const handleSliderChange = useCallback((values) => {
    setSliderValues(values);
  }, []);

  const handleSliderAfterChange = useCallback((values) => {
    setSliderValues(values);
    setQueryParams((prev) => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1],
      page: 1,
    }));
  }, []);

  const handleManualInputChange = useCallback(
    (index, value) => {
      const newValues = [...sliderValues];
      newValues[index] = Number(value);
      setSliderValues(newValues);
      setQueryParams((prev) => ({
        ...prev,
        minPrice: newValues[0],
        maxPrice: newValues[1],
        page: 1,
      }));
    },
    [sliderValues]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      setQueryParams((prev) => ({ ...prev, page: newPage }));
      scrollTo(RefTarget);
    },
    [scrollTo]
  );

  const getFirstTwoSentences = useCallback((text) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 2) {
      return sentences.slice(0, 2).join(" ");
    }
    return text;
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const crumbs = useMemo(
    () => [
      { path: "/", name: "Главная" },
      { path: "/schools", name: "Онлайн-школы" },
      { path: `/${school?.url}`, name: school?.name || "" },
    ],
    [school]
  );

  const truncatedDescription = useMemo(
    () => (school ? getFirstTwoSentences(school.description) : ""),
    [school, getFirstTwoSentences]
  );

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;
  if (!school) return <div>Школа не найдена</div>;

  const SchoolDetailTitle = `${school.name}: список онлайн-курсов школы ${school.name} | COURSES`;
  const SchoolDetailDescription = `${school.description.split(".")[0].trim()}`;

  return (
    <>
      <PageMetadata
        title={SchoolDetailTitle}
        description={SchoolDetailDescription}
      />
      <div className="container">
        <section className="school-detail">
          <div className="school-detail__head block-head">
            <Breadcrumbs crumbs={crumbs} />
            <h1>{school.name}</h1>
            <div className="school-detail__box">
              <div className="school-detail__about">
                <div
                  dangerouslySetInnerHTML={{
                    __html: isExpanded
                      ? school.description
                      : truncatedDescription,
                  }}
                />
                {school.description.length > truncatedDescription.length && (
                  <span onClick={toggleExpand} className="school-detail__link">
                    {isExpanded ? "Свернуть" : "Подробнее..."}
                  </span>
                )}
              </div>
              <div className="school-detail__rating">
                <div className="school-detail__rating__box">
                  <AvgRatingStar className="avg" value={school.rating} />
                  <Link
                    className="school-detail__btn"
                    to={`/schools/${school.url}/reviews`}
                  >
                    <p className="school-reviewcount school-reviewcount_detail">
                      <span>{school.reviews}</span> отзывов о школе
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {initialData && sliderValues && (
            <MobileFilterWrapper
              isFilterOpen={isFilterOpen}
              toggleFilter={toggleFilter}
            >
              <aside className="school-detail__aside">
                <SubcategoryFilter
                  onReady={() => setIsFilterReady(true)}
                  subcategories={filteredSubcategories}
                  selectedSubcategories={queryParams.selectedSubcategories}
                  onSubcategoryChange={handleSubcategoryChange}
                  sliderMin={priceRange[0]}
                  sliderMax={priceRange[1]}
                  sliderValues={sliderValues}
                  handleSliderChange={handleSliderChange}
                  handleSliderAfterChange={handleSliderAfterChange}
                  handleManualInputChange={handleManualInputChange}
                  onReset={handleResetFilters}
                  loading={subcategoriesLoading}
                  isMobile={windowWidth < 1024}
                  toggleFilter={toggleFilter}
                />
              </aside>
            </MobileFilterWrapper>
          )}
          <div
            className="school-detail__body"
            ref={(node) => {
              RefTarget.current = node;
              bodyRef.current = node;
            }}
          >
            <div className="courses-list">
              <div className="courses-list__head">
                <h2>Все курсы {school.name}</h2>
                {windowWidth <= 1024 && (
                  <MobileFilterButton onClick={toggleFilter} />
                )}
              </div>
              {coursesLoading ? (
                <Loading />
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <CourseItem key={course.id} course={course} school={school} />
                ))
              ) : (
                <p>Курсы не найдены</p>
              )}
            </div>
          </div>
          <div className="school-detail__footer">
            <Pagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default SchoolDetail;
