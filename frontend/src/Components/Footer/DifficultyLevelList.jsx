import React from "react";
import CollapsibleList from "./CollapsibleList";

const difficultyLevels = [
  { to: "#", label: "Начальный" },
  { to: "#", label: "Средний" },
  { to: "#", label: "Профессиональный" },
  { to: "#", label: "Для детей" },
];

const DifficultyLevelList = ({ isOpen, onToggle }) => {
  return (
    <CollapsibleList
      title="Уровень сложности"
      items={difficultyLevels}
      isOpen={isOpen}
      onToggle={onToggle}
    />
  );
};

export default DifficultyLevelList;
