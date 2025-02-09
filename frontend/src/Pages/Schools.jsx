import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumbs from "../Components/Breadcrumbs";
import SchoolItem from "../Components/Schools/SchoolItem";
import Pagination from "../Components/Pagination";
import CategoryFilter from "../Components/Schools/CategoryFilter";
import { apiUrl } from "../js/config.js";

const Schools = () => {
  const [schools, setSchools] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const perPage = 10;

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
      <section className="schools">
        <div className="schools__head">
          <Breadcrumbs crumbs={crumbs} />
          <h1>Онлайн-школы</h1>
          <p>Список онлайн-школ с рейтингами, отзывами и категориями.</p>
        </div>

        <div className="schools__aside">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        <div className="schools__body">
          {schools.length > 0 ? (
            schools.map((school) => (
              <SchoolItem key={school.id} school={school} />
            ))
          ) : (
            <p>Загрузка...</p>
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
