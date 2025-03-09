import React, { useState, useContext } from "react";
import axios from "axios";
import { apiUrl } from "../../js/config.js";
import { UserContext } from "../UserContext.jsx";
import { validateEmail, validatePasswordLenght } from "../../js/utils.js";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const { setUser } = useContext(UserContext);

 // Проверка, можно ли активировать кнопку "Войти"
 const isFormValid = () => {
    return validateEmail(email) && validatePasswordLenght(password);
  };

	const handleSubmit = async (e) => {
		e.preventDefault();
		setEmailError(""); // Сбрасываем ошибку email
		setPasswordError(""); // Сбрасываем ошибку пароля
		try {
			const response = await axios.post(`${apiUrl}/api/login`, {
				email,
				password,
			});
			if (response.data.token) {
				localStorage.setItem("token", response.data.token); // Сохраняем токен
				setUser(response.data.user);
				window.location.href = "/profile"; // Перенаправляем на страницу профиля
			}
		} catch (error) {
			if (error.response && error.response.data) {
				const { type, message } = error.response.data;

				// Обрабатываем ошибки в зависимости от типа
				if (type === "email") {
					setEmailError(message); // Устанавливаем ошибку email
				} else if (type === "password") {
					setPasswordError(message); // Устанавливаем ошибку пароля
				} else {
					alert(message); // Выводим остальные ошибки через alert
				}
			} else {
				alert("Произошла ошибка при авторизации"); // Общая ошибка
			}
		}
	};

	//=======================================================
	//ОТРИСОВКА ЭЛЕМЕНТОВ

	return (
		<div className="container auth">
			<h1 className="title auth__title">Авторизация</h1>
			<form className="auth__form" onSubmit={handleSubmit}>
				<div className="auth__form__group">
					<label className="auth__form__label">
						<span>
							{" "}
							Email:{" "}
							{emailError && <span className="auth__error">{emailError}</span>}
						</span>

						<input
							className="auth__form__input"
							type="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</label>
				</div>
				<div className="auth__form__group">
					<label className="auth__form__label">
						<span>
						{" "}
							Пароль: {" "}
							{passwordError && (
								<span className="auth__error">{passwordError}</span>
							)}
						</span>
						<input
							className="auth__form__input"
							type="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
												/>
					</label>
				</div>
				<button type="submit" className="link-btn" disabled={!isFormValid()} >
					Войти
				</button>
			</form>
		</div>
	);
};

export default Login;
