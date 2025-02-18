import React from "react";
import CollapsibleList from "./CollapsibleList";

const reviews = [
  { to: "/schools/skillbox/reviews", label: "Отзывы о Skillbox" },
  { to: "/schools/geekbrains/reviews", label: "Отзывы о Geekbrains" },
  { to: "/schools/netologiya/reviews", label: "Отзывы о Нетология" },
  { to: "/schools/skillfactory/reviews", label: "Отзывы о Skillfactory" },
  {
    to: "/schools/agentstvo-convert-monster/reviews",
    label: "Отзывы о Convertmonster",
  },
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
