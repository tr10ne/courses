import React from "react";
import CollapsibleList from "./CollapsibleList";

const schools = [
  { to: "/schools/skillbox", label: "Skillbox" },
  { to: "/schools/geekbrains", label: "Geekbrains" },
  { to: "/schools/netologiya", label: "Нетология" },
  { to: "/schools/skillfactory", label: "Skillfactory" },
  { to: "/schools/agentstvo-convert-monster", label: "Convertmonster" },
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
