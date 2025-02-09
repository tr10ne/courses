import React from "react";

const Category = ({
  category,
  selectedCategory,
  handleCategoryChange
}) => {



  return (
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
                checked={selectedCategory === category.id.toString()}
              />
            </label>
  );
};

export default Category;