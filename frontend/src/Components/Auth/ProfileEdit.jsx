import React, { useState, useEffect, useContext } from "react";
import { apiUrl } from "../../js/config";
import { UserContext } from "../UserContext";
import Avatar from "./Avatar";
import AvatarSvg from "./AvatarSvg";
import Cross from "../Cross";
import {
	preventSpaceKeyInput,
	validateEmail,
	validateNameLenght,
	validatePasswordLenght,
} from "../../js/utils";
import Eye from "../Eye.jsx";

const ProfileEdit = () => {
	const { user, setUser } = useContext(UserContext);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [showPasswordConfirmation, setShowPasswordConfirmation] = useState("");
	const [avatar, setAvatar] = useState(null);
	const [avatarPreview, setAvatarPreview] = useState("");
	const [userId, setUserId] = useState(null);

	//для вывода уведомлений об ошибках
	const [nameError, setNameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [passwordConfirmationError, setPasswordConfirmationError] =
		useState("");
	const [avatarError, setAvatarError] = useState("");

	//=======================================================
	//ОБЩИЕ ФУНКЦИИ

	//проверка корректности заполнения формы
	function isValid() {
		setNameError("");
		setEmailError("");
		setPasswordError("");
		setPasswordConfirmationError("");

		let error = false;
		if (!validateNameLenght(name)) {
			setNameError("Имя должно быть более 2х символов");
			error = true;
		}

		if (!validateEmail(email)) {
			setEmailError("не корректно введена почта");
			error = true;
		}

		if (password.length > 0 && !validatePasswordLenght(password)) {
			setPasswordError("Пароль должен быть более 8 символов");
			error = true;
		}

		if (passwordConfirmation !== password) {
			setPasswordConfirmationError(
				"Пароль и подтверждение пароля должны совпадать"
			);
			error = true;
		}

		return !error;
	}

	//================================================================
	// РАБОТА С ЗАПРОСОМ

	//запрос на изменение данных
	const handleSubmit = async (e) => {
		e.preventDefault();
		setAvatarError("");
		if (!isValid()) return;

		const formData = new FormData();
		formData.append("name", name.trim());
		formData.append("email", email);
		if (password) {
			formData.append("password", password);
			formData.append("password_confirmation", passwordConfirmation);
		}

		formData.append("avatar", avatar);
		formData.append("_method", "PUT");

		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${apiUrl}/api/users/${userId}`, {
				method: "POST",
				body: formData,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();

			if (response.ok) {
				alert("Профиль успешно обновлен");
				setUser(data.data);
				setName(data.data.name || "");
				setEmail(data.data.email || "");
				if (data.data.avatar) setAvatarPreview(apiUrl + data.data.avatar);
				if (avatarPreview) {
					URL.revokeObjectURL(avatarPreview); // Очищаем старый URL
				}
			} else {
				const { type, message } = data;
				// Обрабатываем ошибки в зависимости от типа
				if (type === "email") {
					setEmailError(message); // Устанавливаем ошибку email
				} else if (type === "avatar") {
					setAvatarError(message); // Устанавливаем ошибку email
				} else {
					alert(message); // Выводим остальные ошибки через alert
				}
			}
		} catch (error) {
			console.error("Ошибка:", error);
		}
	};

	//запрос на удаление профиля
	const handleProfileDelete = async () => {
		const confirmDelete = window.confirm(
			"Вы уверены, что хотите удалить профиль? Это действие нельзя отменить."
		);
		if (!confirmDelete) return; // Если пользователь отменил удаление, выходим

		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${apiUrl}/api/users/${userId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				alert("Профиль успешно удален");
				localStorage.removeItem("token");
				setUser(null);
				window.location.href = "/";
			} else {
				const data = await response.json();
				alert(data.message || "Ошибка при удалении профиля");
			}
		} catch (error) {
			console.error("Ошибка:", error);
			alert("Произошла ошибка при отправке запроса");
		}
	};

	//================================================================
	// РАБОТА СО СТРАНИЦЕЙ

	//заполняем данные о пользователе
	useEffect(() => {
		if (!user) return;
		setName(user.name || "");
		setEmail(user.email || "");
		setUserId(user.id);
		if (user.avatar) setAvatarPreview(apiUrl + user.avatar);
	}, [user]);

	//обработка выбора нового аватара
	const handleAvatarChange = (e) => {
		setAvatarError("");

		const file = e.target.files[0];
		if (file) {
			if (file.size > 2048 * 1024) {
				setAvatarError("Размер файла не должен превышать 2048 КБ");
				return;
			}

			setAvatar(file);
			setAvatarPreview(URL.createObjectURL(file));
		}
	};

	//обработка удаления аватара
	const handleAvatarDelete = (e) => {
		e.preventDefault();
		setAvatar(null);
		setAvatarPreview(null);
		setAvatarError("");
	};

	// очищаем объект URL при размонтировании компонента
	useEffect(() => {
		return () => {
			if (avatarPreview) {
				URL.revokeObjectURL(avatarPreview);
			}
		};
	}, [avatarPreview]);

	//=======================================================
	//ОТРИСОВКА ЭЛЕМЕНТОВ

	return (
		<div className="container auth">
			<h1 className="title auth__title">Редактирование профиля</h1>
			<form onSubmit={handleSubmit} className="auth__form">
				<div className="auth__form__group">
					<label className="auth__form__label">
						<span>
							{" "}
							Имя:{" "}
							{nameError && <span className="auth__error">{nameError}</span>}
						</span>

						<input
							className="auth__form__input"
							autoComplete="username"
							type="text"
							value={name || ""}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</label>
				</div>
				<div className="auth__form__group ">
					<label className="auth__form__label">
						<span>
							{" "}
							Электронная почта:{" "}
							{emailError && <span className="auth__error">{emailError}</span>}
						</span>

						<input
							autoComplete="email"
							type="email"
							className="auth__form__input"
							value={email || ""}
							onChange={(e) => setEmail(e.target.value)}
							required
							onKeyDown={preventSpaceKeyInput}
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
								type={showPassword ? "text" : "password"}
								className="auth__form__input"
								value={password || ""}
								onChange={(e) => setPassword(e.target.value)}
								minLength="8"
								placeholder="Минимум 8 символов"
								autoComplete="new-password"
								onKeyDown={preventSpaceKeyInput}
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
						<span>
							{" "}
							Подтверждение пароля:{" "}
							{passwordConfirmationError && (
								<span className="auth__error">{passwordConfirmationError}</span>
							)}
						</span>

						<div className="password-input-wrapper">
							<input
								type={showPasswordConfirmation ? "text" : "password"}
								className="auth__form__input"
								autoComplete="new-password"
								value={passwordConfirmation || ""}
								onChange={(e) => setPasswordConfirmation(e.target.value)}
								minLength="8"
								onKeyDown={preventSpaceKeyInput}
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
				<div className="auth__form__group auth__form__group_avatar">
					{avatarError && <span className="auth__error">{avatarError}</span>}
					<label tabIndex="0" className="avatar-label">
						{avatarPreview ? (
							<Avatar src={avatarPreview} />
						) : (
							<AvatarSvg isUser={true} />
						)}

						<input
							type="file"
							id="avatar"
							name="avatar"
							accept="image/*"
							onChange={handleAvatarChange}
						/>

						<button className="avatar-delete-btn" onClick={handleAvatarDelete}>
							<Cross />
						</button>
					</label>
				</div>
				<button type="submit" className="link-btn">
					Сохранить изменения
				</button>
			</form>
			<button
				type="button"
				className="auth__remove-profile "
				onClick={handleProfileDelete}
			>
				удалить профиль
			</button>
		</div>
	);
};

export default ProfileEdit;
