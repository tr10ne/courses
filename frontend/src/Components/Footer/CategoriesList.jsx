import React from "react";
import CollapsibleList from "./CollapsibleList";

const categories = [
  { to: "/courses/programmirovanie", label: "Программирование" },
  { to: "/courses/marketing", label: "Маркетинг" },
  { to: "/courses/dizajn-i-sozdanie-kontenta", label: "Дизайн" },
  { to: "/courses/upravlenie", label: "Управление" },
  { to: "/courses/marketing", label: "Контент маркетинг" },
];

const CategoriesList = ({ isOpen, onToggle }) => {
  return (
    <CollapsibleList
      title="Категории"
      items={categories}
      isOpen={isOpen}
      onToggle={onToggle}
    />
  );
};

export default CategoriesList;
