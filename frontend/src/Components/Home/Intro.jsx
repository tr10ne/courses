import React from "react";
import IntroImage from "./IntroImage";

const Intro = ({}) => {
	return (
		<section className="intro">
			<div className="intro__inner container">
				<div className="intro__content">
					<h1 className="intro__title">
						Агрегатор <span>онлайн-курсов</span>{" "}
					</h1>
					<p className="intro__text">
						Сравниваем онлайн-курсы по digital и IT.
					</p>
					<p className="intro__text">
						Мы — каталог-отзовик курсов. Выбирайте курсы по отзывам, цене,
						продолжительности и другим критериям!
					</p>
				</div>
				<IntroImage />
			</div>
		</section>
	);
};

export default Intro;
