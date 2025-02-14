import React from "react";

const SubcategoryFilter = ({
  subcategories,
  selectedSubcategories,
  onSubcategoryChange,
}) => {
  const handleSubcategoryChange = (subcategory_id) => {
    if (selectedSubcategories.includes(subcategory_id)) {
      onSubcategoryChange(
        selectedSubcategories.filter((id) => id !== subcategory_id)
      );
    } else {
      onSubcategoryChange([...selectedSubcategories, subcategory_id]);
    }
  };

  return (
    <aside className="subcategory-filter">
      <p className="subcategory-filter__title">Фильтры</p>
      <div className="subcategory-list">
        {subcategories.length > 0 ? (
          subcategories.map((subcategory) => (
            <div key={subcategory.id} className="subcategory-item">
              <label>
                <input
                  className="custom-checkbox"
                  type="checkbox"
                  checked={selectedSubcategories.includes(subcategory.id)}
                  onChange={() => handleSubcategoryChange(subcategory.id)}
                />
              </label>
              {subcategory.name}
            </div>
          ))
        ) : (
          <div>Подкатегории не найдены</div>
        )}
      </div>
    </aside>
  );
};

export default SubcategoryFilter;
