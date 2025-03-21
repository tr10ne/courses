import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthModal = ({ onClose }) => {
	const [activeTab, setActiveTab] = useState("login");
	const [modalMaxHeight, setModalMaxHeight] = useState(
		window.innerHeight - 150
	);

	// Обновляем высоту модального окна при изменении размеров экрана
	useEffect(() => {
		const handleResize = () => {
			setModalMaxHeight(window.innerHeight - 150);
		};

		window.addEventListener("resize", handleResize);

		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleAuthSuccess = async () => {
		onClose(); // Закрываем модальное окно
	};

	return (
		<div className="auth-modal-overlay">
			<div className="auth-modal">
				<button className="close-btn" onClick={onClose}>
					×
				</button>
				<div className="auth-tabs">
					<button
						className={`tab-link ${activeTab === "login" ? "active" : ""}`}
						onClick={() => setActiveTab("login")}
					>
						Войти
					</button>
					<button
						className={`tab-link ${activeTab === "register" ? "active" : ""}`}
						onClick={() => setActiveTab("register")}
					>
						Регистрация
					</button>
				</div>
				<div
					className="auth-tabs-content"
					style={{
						maxHeight: `${modalMaxHeight}px`, // Устанавливаем максимальную высоту модального окна
					}}
				>
					{activeTab === "login" && (
						<div className="tab-content active" id="login">
							<Login isModal={true} onAuthSuccess={handleAuthSuccess} />
						</div>
					)}
					{activeTab === "register" && (
						<div className="tab-content active" id="register">
							<Register isModal={true} onAuthSuccess={handleAuthSuccess} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AuthModal;
