import React, { useState } from "react";
import { apiUrl } from "../../js/config.js";
import {
	validateEmail,
	validateNameLenght,
	validatePasswordLenght,
	preventSpaceKeyInput,
} from "../../js/utils.js";

const Register = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [emailError, setEmailError] = useState("");

	// Проверка, можно ли активировать кнопку "Зарегистрироваться"
	const isFormValid = () => {
		return (
			validateNameLenght(name) &&
			validateEmail(email) &&
			validatePasswordLenght(password) &&
			password === passwordConfirmation
		);
	};

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
				// Перенаправление на другую страницу или обновление состояния
			} else {
				if (data.errors) {
					if (data.errors.email) {
						setEmailError(data.errors.email[0]); // Устанавливаем ошибку email
					} else {
						// Выводим остальные ошибки через alert
						const errorMessage = Object.values(data.errors).flat().join("\n");
						alert(errorMessage);
					}
				} else {
					alert(data.message || "Ошибка при регистрации");
				}
			}
		} catch (error) {
			console.error("Ошибка:", error);
			alert("Произошла ошибка при отправке запроса");
		}
	};

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
						<input
							className="auth__form__input"
							type="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							onKeyDown={preventSpaceKeyInput}
						/>
					</label>
				</div>
				<div className="auth__form__group">
					<label className="auth__form__label">
						Подтвердите пароль:
						<input
							className="auth__form__input"
							type="password"
							name="password_confirmation"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							required
							onKeyDown={preventSpaceKeyInput}
						/>
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
