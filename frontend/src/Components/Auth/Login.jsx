import React, { useState, useContext } from "react";
import axios from "axios";
import { apiUrl } from "../../js/config.js";
import { UserContext } from "../UserContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      console.error("Ошибка при авторизации:", error);
    }
  };

	return (
		<div className="container auth">
			<h1 className="title auth__title">
				Авторизация
			</h1>
			<form className="auth__form" onSubmit={handleSubmit}>
				<div className="auth__form__group">
					<label className="auth__form__label">Email
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
					<label className="auth__form__label">Пароль:

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
				<button type="submit" className="link-btn">Войти</button>
			</form>
		</div>
	);
};

export default Login;
