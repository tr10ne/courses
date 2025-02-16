import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Breadcrumbs from "../Components/Breadcrumbs";
import SchoolItem from "../Components/Schools/SchoolItem";
import Pagination from "../Components/Pagination";
import CategoryFilter from "../Components/Schools/CategoryFilter";
import { apiUrl } from "../js/config.js";
import Loading from "../Components/Loading";

const Schools = () => {
  const [schools, setSchools] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
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
      })
      .catch((error) => {
        console.error("Ошибка при загрузке школ:", error);
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

  return (
    <div className="container">
      <section className="schools section">
        <div className="schools__head block-head">
          <Breadcrumbs crumbs={crumbs} />
          <h1 className="title">Онлайн-школы</h1>
          <p className="text">
            Список онлайн-школ с рейтингами, отзывами и категориями.
          </p>
        </div>
        <aside className="schools__aside">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
        </aside>
        <div className="schools__body" ref={RefTarget}>
          {schools.length > 0 ? (
            schools.map((school) => (
              <SchoolItem key={school.id} school={school} />
            ))
          ) : (
            <Loading />
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
  );
};

export default Schools;
