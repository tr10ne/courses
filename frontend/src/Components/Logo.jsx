import React, { useState, useEffect, useRef } from "react";

const Logo = () => {
	const [text, setText] = useState(""); // Текст, который будет появляться по буквам
	const [showCursor, setShowCursor] = useState(false); // Видимость курсора
	const [isAnimating, setIsAnimating] = useState(true); // Флаг для запуска анимации
	const logoSvgRef = useRef(null);
	const fullText = "Courses"; // Текст, который будет появляться

	useEffect(() => {
		// Запуск анимации через 1 секунду
		const animationTimeout = setTimeout(() => {
			setIsAnimating(true);
		}, 1000);

		return () => clearTimeout(animationTimeout);
	}, []);



	useEffect(() => {
		if (isAnimating) {
			const typingInterval = setInterval(() => {
				setText((prevText) => {
					if (prevText.length < fullText.length) {
						const newText = fullText.slice(0, prevText.length + 1);

						if (newText.length === fullText.length) {
							setShowCursor(false);
						} else setShowCursor(true);

						return newText;
					} else {
						clearInterval(typingInterval);
						setIsAnimating(false);
						return prevText;
					}
				});
			}, 250);

			return () => clearInterval(typingInterval);
		}
	}, [isAnimating]);

    	return (
		<div className={`logo ${isAnimating ? "active" : ""}`}>
			<svg
				viewBox="0 0 318.11 329.75"
				className="logo__svg"
				style={{ strokeWidth: 11.83, strokeMiterlimit: 22.9256 }}
			>
				<path d="M208.95 5.92c-17.55 0-32.13 12.81-34.96 29.57H149.8c-19.57 0-35.49 15.91-35.49 35.47V191.92H76.36c-2.83-16.76-17.41-29.58-34.96-29.58-19.57 0-35.48 15.92-35.48 35.49s15.91 35.49 35.48 35.49c17.55 0 32.13-12.82 34.96-29.57h71.17c9.31 0 16.88 7.58 16.88 16.89V265.54c0 15.84 12.88 28.72 28.72 28.72h24.82c2.83 16.76 17.4 29.58 34.95 29.58 19.57 0 35.49-15.92 35.49-35.49s-15.92-35.49-35.49-35.49c-17.55 0-32.12 12.82-34.95 29.57h-24.82c-9.31 0-16.89-7.57-16.89-16.89V220.64c0-15.84-12.88-28.72-28.71-28.72h-21.39V70.96c0-13.04 10.62-23.64 23.66-23.64h24.19c2.83 16.76 17.41 29.57 34.96 29.57 19.57 0 35.49-15.92 35.49-35.49S228.52 5.92 208.95 5.92zm16.26 148.01H163.4V142.1h78.35c2.83-16.76 17.41-29.58 34.96-29.58 19.57 0 35.49 15.92 35.49 35.49s-15.92 35.49-35.49 35.49c-17.55 0-32.13-12.82-34.96-29.57h-16.54zm27.69 110.76c13.05 0 23.66 10.61 23.66 23.66 0 13.04-10.61 23.66-23.66 23.66s-23.66-10.62-23.66-23.66c0-13.05 10.61-23.66 23.66-23.66zm23.81-93.02c13.04 0 23.66-10.61 23.66-23.66 0-13.04-10.62-23.66-23.66-23.66-13.05 0-23.66 10.62-23.66 23.66 0 13.05 10.61 23.66 23.66 23.66zM41.4 221.49c-13.04 0-23.66-10.61-23.66-23.66 0-13.04 10.62-23.66 23.66-23.66 13.05 0 23.66 10.62 23.66 23.66 0 13.05-10.61 23.66-23.66 23.66zM208.95 65.06c-13.05 0-23.66-10.61-23.66-23.66 0-13.04 10.61-23.65 23.66-23.65 13.04 0 23.66 10.61 23.66 23.65 0 13.05-10.62 23.66-23.66 23.66z" />
			</svg>
			<span className="logo__text">{text}</span>
			{showCursor && <span className="logo__cursor">|</span>}
		</div>
	);
};

export default Logo;
