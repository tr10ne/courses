import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../js/config.js";

const CategoryFilter = ({ selectedCategories, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Индикатор загрузки категорий

  useEffect(() => {
    // Загружаем список категорий с API
    axios
      .get(`${apiUrl}/api/categories`)
      .then((response) => {
        let categoriesData = [];

        // Проверяем формат данных
        if (Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (response.data && response.data.data) {
          categoriesData = response.data.data;
        } else {
          console.error("Неизвестный формат данных");
        }

        setCategories(categoriesData);
        setLoading(false); // Загружены данные, отключаем индикатор загрузки
      })
      .catch((error) => {
        console.error("Ошибка при загрузке категорий:", error);
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (categoryId) => {
    // Если категория уже выбрана, убираем ее
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter((id) => id !== categoryId));
    } else {
      // Добавляем категорию в список выбранных
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  // Если данные еще загружаются
  if (loading) {
    return <div>Загрузка категорий...</div>;
  }

  return (
    <div className="category-filter">
      <p className="category-filter__title">Категория школы</p>
      <div className="category-list">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="category-item">
              <label>
                <input
                  className="custom-checkbox"
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                />
                {category.name}
              </label>
            </div>
          ))
        ) : (
          <div>Категории не найдены</div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
