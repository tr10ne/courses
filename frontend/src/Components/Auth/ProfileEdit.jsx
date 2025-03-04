import React, { useState, useEffect } from "react";
import { apiUrl } from "../../js/config";

const ProfileEdit = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [avatar, setAvatar] = useState(null);
	const [avatarPreview, setAvatarPreview] = useState("");
	const [userId, setUserId] = useState(null);

	// Загрузка данных текущего пользователя
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await fetch(`${apiUrl}/api/user`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await response.json();
				if (response.ok) {
					setName(data.name || ""); // Если data.name === null, используем пустую строку
					setEmail(data.email || ""); // Если data.email === null, используем пустую строку
					setUserId(data.id);
					setAvatarPreview(data.avatar || ""); // Если data.avatar === null, используем пустую строку
				} else {
					alert("Ошибка при загрузке данных пользователя");
				}
			} catch (error) {
				console.error("Ошибка:", error);
			}
		};

		fetchUserData();
	}, []);

	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setAvatar(file);
			setAvatarPreview(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newData = {
			name: name,
			email: email,
			password: password,
		};

		if(avatar){
			newData['avatar'] = avatar
		}
		
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${apiUrl}/api/users/${userId}`, {
				method: "PUT",
				body: JSON.stringify(newData),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();

			if (response.ok) {
				alert("Профиль успешно обновлен");
				// Обновляем состояние
				setName(data.data.name || "");
				setEmail(data.data.email || "");
				setAvatarPreview(data.data.avatar || "");
			} else {
				alert(data.data.message || "Ошибка при обновлении профиля");
			}
		} catch (error) {
			console.error("Ошибка:", error);
		}
	};

	return (
		<div className="container">
			<h2 className="profile-title">Редактирование профиля</h2>
			<form
				onSubmit={handleSubmit}
				className="profile-form"
				encType="multipart/form-data"
			>
				<div className="form-group">
					<label htmlFor="name">Имя:</label>
					<input
						autoComplete="username"
						type="text"
						className="form-control"
						id="name"
						value={name || ""} // Если name === undefined, используем пустую строку
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="email">Электронная почта:</label>
					<input
						autoComplete="email"
						type="email"
						className="form-control"
						id="email"
						value={email || ""} // Если email === undefined, используем пустую строку
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Пароль:</label>
					<input
						type="password"
						className="form-control"
						id="password"
						value={password || ""} // Если password === undefined, используем пустую строку
						onChange={(e) => setPassword(e.target.value)}
						minLength="8"
						placeholder="Минимум 8 символов"
						autoComplete="new-password"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password_confirmation">Подтверждение пароля:</label>
					<input
						type="password"
						autoComplete="new-password"
						className="form-control"
						id="password_confirmation"
						value={passwordConfirmation || ""} // Если passwordConfirmation === undefined, используем пустую строку
						onChange={(e) => setPasswordConfirmation(e.target.value)}
						minLength="8"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="avatar" className="avatar-label">
						Изменить аватар:
					</label>
					<img
						className="profile-avatar"
						id="avatarPreview"
						src={avatarPreview || "/images/avatar-default.png"}
						alt="Avatar"
					/>
					<input
						type="file"
						className="form-control-file"
						id="avatar"
						name="avatar"
						accept="image/*"
						onChange={handleAvatarChange}
					/>
				</div>
				<button type="submit" className="btn profile-btn">
					Сохранить изменения
				</button>
			</form>
		</div>
	);
};

export default ProfileEdit;
