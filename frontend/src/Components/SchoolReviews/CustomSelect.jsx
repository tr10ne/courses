import React, { useState, useEffect, useRef } from "react";

const CustomSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const selectRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value) => {
    setSelectedValue(value);
    onChange(value);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Фильтруем опции, исключая выбранное значение
  const filteredOptions = options.filter(
    (option) => option.value !== selectedValue
  );

  return (
    <div className="custom-select" ref={selectRef}>
      <div className="custom-select__header" onClick={handleToggle}>
        <span className="custom-select__selected">
          {options.find((option) => option.value === selectedValue)?.label}
        </span>
        <span className={`custom-select__arrow ${isOpen ? "open" : ""}`}>
          ▼
        </span>
      </div>
      {isOpen && (
        <div className="custom-select__options">
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="custom-select__option"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
