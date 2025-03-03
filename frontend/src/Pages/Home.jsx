import React, { useEffect, useState } from "react";
import Intro from "../Components/Home/Intro";
import About from "../Components/Home/About";
import Directions from "../Components/Home/Directions";
import { loadCategories } from "../js/loadCategories.js";
import PopularCourses from "../Components/Home/PopularCourses/PopularCourses";
import PageMetadata from "../Components/PageMetadata";

const Home = () => {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    loadCategories()
      .then((loadedCategories) => {
        setCategories(loadedCategories);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке категорий:", error);
      });
  }, []);

  const HomeTitle =
    "Реальные отзывы об онлайн-курсах и школах от студентов и учеников | Агрегатор онлайн-курсов COURSES";
  const HomeDescription =
    "Агрегатор онлайн-курсов COURSES представляет реальные отзывы от студентов и учеников о пройденных курсах в IT школах.";

  return (
    <>
      <PageMetadata title={HomeTitle} description={HomeDescription} />
      <Intro />
      <About />
      <Directions categories={categories} />
      <PopularCourses categories={categories} />
    </>
  );
};

export default Home;
