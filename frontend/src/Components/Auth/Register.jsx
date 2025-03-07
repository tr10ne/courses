import React, { useState } from "react";
import { apiUrl } from "../../js/config.js";

const Register = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("name", name);
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
				alert(data.message || "Ошибка при регистрации");
			}
		} catch (error) {
			console.error("Ошибка:", error);
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
						Email:
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
						Пароль:
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
						/>
					</label>
				</div>
				<button className="link-btn" type="submit">
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
};

export default Register;
