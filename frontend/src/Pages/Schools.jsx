import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Breadcrumbs from "../Components/Breadcrumbs";
import SchoolItem from "../Components/Schools/SchoolItem";
import Pagination from "../Components/Pagination";
import CategoryFilter from "../Components/Schools/CategoryFilter";
import { apiUrl } from "../js/config.js";
import Loading from "../Components/Loading";
import PageMetadata from "../Components/PageMetadata";

const Schools = () => {
  const [schools, setSchools] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const perPage = 10;

  const RefTarget = useRef(null);

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
    setIsLoading(true);
    const categoriesQuery =
      selectedCategories.length > 0
        ? `&categories=${selectedCategories.join(",")}`
        : "";

    axios
      .get(
        `${apiUrl}/api/schools?page=${pagination.current_page}&per_page=${perPage}${categoriesQuery}`
      )
      .then((response) => {
        setSchools(response.data.data || []);
        setPagination(response.data.meta);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке школ:", error);
        setIsLoading(false);
      });
  }, [pagination.current_page, selectedCategories]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current_page: newPage }));

    scrollTo(RefTarget);
  };

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
  };

  const crumbs = [
    { path: "/", name: "Главная" },
    { path: "/schools", name: "Онлайн-школы" },
  ];

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

  const SchoolsTitle = `${title}: список онлайн школ с рейтингом и отзывами | COURSES`;
  const SchoolsDescription = description.split(".")[0].trim();

  return (
    <>
      <PageMetadata title={SchoolsTitle} description={SchoolsDescription} />
      <div className="container">
        <section className="schools section">
          <div className="schools__head block-head">
            <Breadcrumbs crumbs={crumbs} />
            <h1 className="title" ref={titleRef}>
              Онлайн-школы
            </h1>
            <p className="text" ref={descriptionRef}>
              Список онлайн-школ, преподающих Онлайн-курсы с рейтингом, отзывами
              и детальным описанием курса 2021 года. Подробные описания, цены,
              удобное сравнение характеристик курса.
            </p>
          </div>
          <aside className="schools__aside">
            <CategoryFilter
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
          </aside>
          <div className="schools__body" ref={RefTarget}>
            {isLoading ? (
              <Loading />
            ) : schools.length > 0 ? (
              schools.map((school) => (
                <SchoolItem key={school.id} school={school} />
              ))
            ) : (
              <div>Школы не найдены</div>
            )}
          </div>

          <div className="schools__footer">
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

export default Schools;
