import React from "react";
import CollapsibleList from "./CollapsibleList";

const categories = [
  { to: "#", label: "Программирование" },
  { to: "#", label: "Маркетинг" },
  { to: "#", label: "Дизайн" },
  { to: "#", label: "Управление" },
  { to: "#", label: "Контент маркетинг" },
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
