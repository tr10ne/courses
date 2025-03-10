import React, { useState } from "react";
import { apiUrl } from "../../js/config.js";
import {
	validateEmail,
	validateNameLenght,
	validatePasswordLenght,
	preventSpaceKeyInput,
} from "../../js/utils.js";

import Eye from "../Eye.jsx";

const Register = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [showPasswordConfirmation, setShowPasswordConfirmation] = useState("");

	const [emailError, setEmailError] = useState("");

	//=======================================================
	//ОБЩИЕ ФУНКЦИИ

	// Проверка, для активировации кнопки "Зарегистрироваться"
	const isFormValid = () => {
		return (
			validateNameLenght(name) &&
			validateEmail(email) &&
			validatePasswordLenght(password) &&
			password === passwordConfirmation
		);
	};

	//================================================================
	// РАБОТА С ЗАПРОСОМ

	//запрос на регистрацию пользователя
	const handleSubmit = async (e) => {
		e.preventDefault();
		setEmailError("");

		const formData = new FormData();
		formData.append("name", name.trim());
		formData.append("email", email);
		if (password) {
			formData.append("password", password);
			formData.append("password_confirmation", passwordConfirmation);
		}

		try {
			const response = await fetch(`${apiUrl}/api/register`, {
				method: "POST",
				body: formData,
			});
			const data = await response.json();
			if (response.ok) {
				alert("Успешная регистрация");
				window.location.href = "/login";
			} else {
				const { type, message } = data;
				// Обрабатываем ошибки в зависимости от типа
				if (type === "email") {
					setEmailError(message); // Устанавливаем ошибку email
				} else {
					alert(message); // Выводим остальные ошибки через alert
				}
			}
		} catch (error) {
			alert("Произошла ошибка при регистрации");
		}
	};

	//=======================================================
	//ОТРИСОВКА ЭЛЕМЕНТОВ

	return (
		<div className="container auth">
			<h1 className="title auth__title">Регистрация</h1>
			<form className="auth__form" onSubmit={handleSubmit}>
				<div className="auth__form__group">
					<label className="auth__form__label">
						Имя:
						<input
							className="auth__form__input"
							type="text"
							name="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</label>
				</div>
				<div className="auth__form__group">
					<label className="auth__form__label">
						<span>
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
							onKeyDown={preventSpaceKeyInput}
						/>
					</label>
				</div>
				<div className="auth__form__group">
					<label className="auth__form__label">
						Пароль:
						<div className="password-input-wrapper">
							<input
								className="auth__form__input"
								type={showPassword ? "text" : "password"}
								name="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								onKeyDown={preventSpaceKeyInput}
								minLength="8"
								placeholder="Минимум 8 символов"
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
				<div className="auth__form__group">
					<label className="auth__form__label">
						Подтвердите пароль:
						<div className="password-input-wrapper">
							<input
								className="auth__form__input"
								type={showPasswordConfirmation ? "text" : "password"}
								name="password_confirmation"
								value={passwordConfirmation}
								onChange={(e) => setPasswordConfirmation(e.target.value)}
								required
								onKeyDown={preventSpaceKeyInput}
								minLength="8"
							/>

							<button
								type="button"
								className="password-toggle-btn"
								onClick={() =>
									setShowPasswordConfirmation(!showPasswordConfirmation)
								}
							>
								<Eye isClose={!showPasswordConfirmation} />
							</button>
						</div>
					</label>
				</div>
				<button className="link-btn" type="submit" disabled={!isFormValid()}>
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
};

export default Register;
