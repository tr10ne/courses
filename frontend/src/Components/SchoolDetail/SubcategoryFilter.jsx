import React, { useState, useEffect, useRef, useCallback } from "react";
import PriceFilter from "../Courses/PriceFilter";
import Loading from "../Loading";
import ApplyFiltersButton from "../ApplyFiltersButton";

const SubcategoryFilter = React.forwardRef(
  (
    {
      onReady,
      subcategories,
      selectedSubcategories,
      onSubcategoryChange,
      sliderMin,
      sliderMax,
      sliderValues,
      handleSliderChange,
      handleSliderAfterChange,
      handleManualInputChange,
      onReset,
      loading,
      onApplyFilters,
      isMobile,
      toggleFilter,
    },
    ref
  ) => {
    const [showAllSubcategories, setShowAllSubcategories] = useState(false);
    const [tempSelectedSubcategories, setTempSelectedSubcategories] = useState(
      selectedSubcategories
    );
    const [tempSliderValues, setTempSliderValues] = useState(sliderValues);
    const [hasChanges, setHasChanges] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({});

    const priceFilterRef = useRef(null);
    const leftSliderRef = useRef(null);
    const rightSliderRef = useRef(null);
    const subcategoryRefs = useRef({});

    const checkForChanges = useCallback(
      (newSubcategories, newSliderValues) => {
        const subcategoriesChanged =
          JSON.stringify(newSubcategories.sort()) !==
          JSON.stringify(selectedSubcategories.sort());
        const sliderChanged =
          newSliderValues[0] !== sliderValues[0] ||
          newSliderValues[1] !== sliderValues[1];
        setHasChanges(subcategoriesChanged || sliderChanged);
      },
      [selectedSubcategories, sliderValues]
    );

    // Синхронизация значений при изменении пропсов
    useEffect(() => {
      setTempSelectedSubcategories(selectedSubcategories);
      setTempSliderValues(sliderValues);
      checkForChanges(selectedSubcategories, sliderValues);
    }, [selectedSubcategories, sliderValues, checkForChanges]);

    const handleSubcategoryChange = (subcategory_id) => {
      const newSelected = tempSelectedSubcategories.includes(subcategory_id)
        ? tempSelectedSubcategories.filter((id) => id !== subcategory_id)
        : [...tempSelectedSubcategories, subcategory_id];

      setTempSelectedSubcategories(newSelected);
      checkForChanges(newSelected, tempSliderValues);
      updateButtonPosition(`subcategory-${subcategory_id}`);

      if (!isMobile) {
        onSubcategoryChange(newSelected);
      }
    };

    const handlePriceChange = (values) => {
      setTempSliderValues(values);
      checkForChanges(tempSelectedSubcategories, values);
      updateButtonPosition("price");
    };

    const handlePriceAfterChange = (values) => {
      setTempSliderValues(values);
      checkForChanges(tempSelectedSubcategories, values);
      if (!isMobile) {
        handleSliderAfterChange(values);
      }
    };

    const handleShowAllSubcategories = () => {
      setShowAllSubcategories((prev) => !prev);
    };

    const handleApplyFilters = () => {
      if (typeof onApplyFilters === "function") {
        onApplyFilters();
      }
      onSubcategoryChange(tempSelectedSubcategories);
      handleSliderAfterChange(tempSliderValues);
      setHasChanges(false);

      if (typeof toggleFilter === "function") {
        toggleFilter();
      }
    };

    const handleReset = () => {
      setTempSelectedSubcategories([]);
      setTempSliderValues([sliderMin, sliderMax]);
      checkForChanges([], [sliderMin, sliderMax]);
      onReset();

      if (!isMobile) {
        onSubcategoryChange([]);
        handleSliderAfterChange([sliderMin, sliderMax]);
      }
    };

    const updateButtonPosition = (elementId) => {
      let element;

      if (elementId === "price") {
        const leftRect = leftSliderRef.current?.getBoundingClientRect();
        const rightRect = rightSliderRef.current?.getBoundingClientRect();

        if (leftRect && rightRect) {
          const mouseX = window.event?.clientX || leftRect.right;
          const leftDistance = Math.abs(mouseX - leftRect.right);
          const rightDistance = Math.abs(mouseX - rightRect.left);

          element =
            leftDistance < rightDistance
              ? leftSliderRef.current
              : rightSliderRef.current;
        }
      } else {
        element = subcategoryRefs.current[elementId];
      }

      if (element) {
        const rect = element.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const middle = screenWidth / 2;

        if (rect.left < middle) {
          setButtonPosition({
            left: rect.right + 10,
            top: rect.top + rect.height / 2,
          });
        } else {
          setButtonPosition({
            left: rect.left - 90,
            top: rect.top + rect.height / 2,
          });
        }
      }
    };

    useEffect(() => {
      onReady();
    }, [onReady]);

    const displayedSubcategories = showAllSubcategories
      ? subcategories
      : subcategories.slice(0, 7);

    return (
      <div className="subcategory-filter" ref={ref}>
        <div className="subcategory-filter__head">
          <p className="subcategory-filter__head__title">Фильтры</p>
          <div className="subcategory-filter__reset" onClick={handleReset}>
            <svg
              width="19.937622"
              height="17.875000"
              viewBox="0 0 19.9376 17.875"
              fill="none"
            >
              <defs />
              <path
                d="M14.09 3.09L12.5 3.09L13.83 1.76C13.93 1.66 14 1.55 14.05 1.42C14.11 1.3 14.13 1.16 14.13 1.03C14.13 0.89 14.11 0.76 14.05 0.63C14 0.51 13.93 0.39 13.83 0.3C13.73 0.2 13.62 0.13 13.5 0.07C13.37 0.02 13.24 0 13.1 0C12.97 0 12.83 0.02 12.71 0.07C12.58 0.13 12.47 0.2 12.37 0.3L9.28 3.39C9.18 3.49 9.11 3.6 9.05 3.73C9 3.85 8.98 3.98 8.98 4.12C8.98 4.26 9 4.39 9.05 4.51C9.11 4.64 9.18 4.75 9.28 4.85L12.37 7.94C12.56 8.14 12.83 8.25 13.1 8.25C13.37 8.25 13.64 8.14 13.83 7.94C14.02 7.75 14.13 7.49 14.13 7.21C14.13 6.94 14.02 6.68 13.83 6.48L12.5 5.15L14.09 5.15C15.09 5.15 16.05 5.55 16.76 6.26C17.47 6.97 17.87 7.93 17.87 8.93C17.87 9.94 17.47 10.9 16.76 11.61C16.05 12.32 15.09 12.71 14.09 12.71C13.82 12.71 13.55 12.82 13.36 13.02C13.17 13.21 13.06 13.47 13.06 13.75C13.06 14.02 13.17 14.28 13.36 14.47C13.55 14.67 13.82 14.78 14.09 14.78C17.31 14.78 19.93 12.15 19.93 8.93C19.93 5.71 17.31 3.09 14.09 3.09Z"
                fill="#C4C4C4"
                fillOpacity="1.000000"
                fillRule="nonzero"
              />
              <path
                d="M7.6 9.92C7.41 9.73 7.14 9.62 6.87 9.62C6.6 9.62 6.33 9.73 6.14 9.92C5.95 10.12 5.84 10.38 5.84 10.65C5.84 10.79 5.87 10.92 5.92 11.05C5.97 11.17 6.04 11.28 6.14 11.38L7.47 12.71L5.84 12.71C4.84 12.71 3.87 12.32 3.16 11.61C2.46 10.9 2.06 9.94 2.06 8.93C2.06 7.93 2.46 6.97 3.16 6.26C3.87 5.55 4.84 5.15 5.84 5.15C6.11 5.15 6.37 5.04 6.57 4.85C6.76 4.66 6.87 4.39 6.87 4.12C6.87 3.85 6.76 3.58 6.57 3.39C6.37 3.2 6.11 3.09 5.84 3.09C2.62 3.09 0 5.71 0 8.93C0 12.15 2.62 14.78 5.84 14.78L7.47 14.78L6.14 16.11C5.95 16.3 5.84 16.57 5.84 16.84C5.84 17.11 5.95 17.37 6.14 17.57C6.33 17.76 6.6 17.87 6.87 17.87C7.14 17.87 7.41 17.76 7.6 17.57L10.69 14.47C10.79 14.38 10.86 14.26 10.92 14.14C10.97 14.01 11 13.88 11 13.75C11 13.61 10.97 13.48 10.92 13.35C10.86 13.23 10.79 13.11 10.69 13.02L7.6 9.92Z"
                fill="#C4C4C4"
                fillOpacity="1.000000"
                fillRule="nonzero"
              />
            </svg>
          </div>
        </div>
        <div className="subcategory-filter__body">
          <div className="subcategory-pricefilter" ref={priceFilterRef}>
            <p className="subcategory-pricefilter__title">Цена</p>
            <PriceFilter
              disabledPrise={false}
              sliderMin={Number(sliderMin)}
              sliderMax={Number(sliderMax)}
              sliderValues={tempSliderValues.map(Number)}
              handleSliderChange={handlePriceChange}
              handleSliderAfterChange={handlePriceAfterChange}
              handleManualInputChange={(index, value) => {
                const newValues = [...tempSliderValues];
                newValues[index] = Number(value);
                setTempSliderValues(newValues);
                checkForChanges(tempSelectedSubcategories, newValues);
                updateButtonPosition("price");

                if (!isMobile) {
                  handleSliderAfterChange(newValues);
                }
              }}
              leftSliderRef={leftSliderRef}
              rightSliderRef={rightSliderRef}
              isMobile={isMobile}
            />
          </div>
          <div className="subcategory-list">
            <p className="subcategory-list__title">Категория</p>
            {loading ? (
              <Loading />
            ) : displayedSubcategories.length > 0 ? (
              displayedSubcategories.map((subcategory) => (
                <div key={subcategory.id} className="subcategory-item">
                  <label>
                    <input
                      className="custom-checkbox custom-checkbox_detail"
                      type="checkbox"
                      checked={tempSelectedSubcategories.includes(
                        subcategory.id
                      )}
                      onChange={() => handleSubcategoryChange(subcategory.id)}
                      ref={(el) => {
                        subcategoryRefs.current[
                          `subcategory-${subcategory.id}`
                        ] = el;
                      }}
                    />
                  </label>
                  {subcategory.name}
                </div>
              ))
            ) : (
              <div>Подкатегории не найдены</div>
            )}
            {!loading && subcategories.length > 7 && (
              <button
                onClick={handleShowAllSubcategories}
                className="show-all-button"
              >
                {showAllSubcategories ? "Скрыть" : "Показать все"}
              </button>
            )}
          </div>
        </div>
        {hasChanges && isMobile && (
          <ApplyFiltersButton
            onClick={handleApplyFilters}
            buttonPosition={buttonPosition}
          />
        )}
      </div>
    );
  }
);

export default SubcategoryFilter;
