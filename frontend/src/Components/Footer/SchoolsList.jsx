import React from "react";
import CollapsibleList from "./CollapsibleList";

const schools = [
  { to: "#", label: "Skillbox" },
  { to: "#", label: "Geekbrains" },
  { to: "#", label: "Нетология" },
  { to: "#", label: "Skillfactory" },
  { to: "#", label: "Convertmonster" },
];

const SchoolsList = ({ isOpen, onToggle }) => {
  return (
    <CollapsibleList
      title="Школы"
      items={schools}
      isOpen={isOpen}
      onToggle={onToggle}
    />
  );
};

export default SchoolsList;
