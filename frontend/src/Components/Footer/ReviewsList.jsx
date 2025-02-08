import React from "react";
import CollapsibleList from "./CollapsibleList";

const reviews = [
  { to: "#", label: "Отзывы о Skillbox" },
  { to: "#", label: "Отзывы о Geekbrains" },
  { to: "#", label: "Отзывы о Нетология" },
  { to: "#", label: "Отзывы о Skillfactory" },
  { to: "#", label: "Отзывы о Convertmonster" },
];

const ReviewsList = ({ isOpen, onToggle }) => {
  return (
    <CollapsibleList
      title="Отзывы о школах"
      items={reviews}
      isOpen={isOpen}
      onToggle={onToggle}
    />
  );
};

export default ReviewsList;
