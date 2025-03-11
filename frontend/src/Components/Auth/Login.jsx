import React, { useState, useContext } from "react";
import axios from "axios";
import { apiUrl } from "../../js/config.js";
import { UserContext } from "../UserContext.jsx";
import { validateEmail, validatePasswordLenght } from "../../js/utils.js";
import Eye from "../Eye.jsx";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const { setUser } = useContext(UserContext);

	//=======================================================
	//ОБЩИЕ ФУНКЦИИ

	// Проверка, для активации кнопки "Войти"
	const isFormValid = () => {
		return validateEmail(email) && validatePasswordLenght(password);
	};

	//================================================================
	// РАБОТА С ЗАПРОСОМ

	//запрос на вход пользователя
	const handleSubmit = async (e) => {
		e.preventDefault();
		setEmailError("");
		setPasswordError("");
		try {
			const response = await axios.post(`${apiUrl}/api/login`, {
				email,
				password,
			});
			if (response.data.token) {
				localStorage.setItem("token", response.data.token); // Сохраняем токен
				setUser(response.data.user);
				window.location.href = "/user/profile";
			}
		} catch (error) {
			if (error.response && error.response.data) {
				const { type, message } = error.response.data;

				// Обрабатываем ошибки в зависимости от типа
				if (type === "email") {
					setEmailError(message);
				} else if (type === "password") {
					setPasswordError(message);
				} else {
					alert(message);
				}
			} else {
				alert("Произошла ошибка при авторизации");
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
							Пароль:{" "}
							{passwordError && (
								<span className="auth__error">{passwordError}</span>
							)}
						</span>
						<div className="password-input-wrapper">
							<input
								className="auth__form__input"
								type={showPassword ? "text" : "password"}
								name="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<button
								type="button"
								className="password-toggle-btn"
								onClick={() => setShowPassword(!showPassword)}
							>
								<Eye isClose={!showPassword} />
							</button>
						</div>
					</label>
				</div>
				<button type="submit" className="link-btn" disabled={!isFormValid()}>
					Войти
				</button>
			</form>
		</div>
	);
};

export default Login;
