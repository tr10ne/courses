import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const Courses = () => {
  const [sliderValues, setSliderValues] = useState([0, 1000]);
  const [sliderMin, setSliderMin] = useState(0);
  const [sliderMax, setSliderMax] = useState(1000);

  // Пример загрузки данных
  useEffect(() => {
    // Загрузите minPrice и maxPrice с сервера
    setSliderMin(0);
    setSliderMax(1000);
    setSliderValues([0, 1000]);
  }, []);

  const handleSliderChange = (values) => {
    setSliderValues(values);
  };

  const handleSliderAfterChange = (values) => {
    setSliderValues(values);
    // Обновите список курсов
  };

  return (
    <div className="price-filter">
      <p>
        Цена: от {sliderValues[0]} до {sliderValues[1]}
      </p>
      <Slider
        range
        min={sliderMin}
        max={sliderMax}
        value={sliderValues}
        onChange={handleSliderChange}
        onAfterChange={handleSliderAfterChange}
      />
    </div>
  );
};

export default Courses;