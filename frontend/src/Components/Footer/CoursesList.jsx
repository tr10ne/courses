import React from "react";
import CollapsibleList from "./CollapsibleList";

const courses = [
  { to: "#", label: "С дипломом" },
  { to: "#", label: "С трудоустройством" },
  { to: "#", label: "Платные" },
  { to: "#", label: "Бесплатные" },
  { to: "#", label: "Ближайшие по дате старта" },
];

const CoursesList = ({ isOpen, onToggle }) => {
  return (
    <CollapsibleList
      title="Курсы"
      items={courses}
      isOpen={isOpen}
      onToggle={onToggle}
    />
  );
};

export default CoursesList;
