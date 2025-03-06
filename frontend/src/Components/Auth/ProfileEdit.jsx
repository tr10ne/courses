import React, { useState, useEffect } from "react";
import { apiUrl } from "../../js/config";
import Avatar from "./Avatar";
import AvatarSvg from "./AvatarSvg";

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
					setName(data.name || "");
					setEmail(data.email || "");
					setUserId(data.id);
					// setAvatarPreview(data.avatar || "");
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

		const formData = new FormData();
		formData.append("name", name);
		formData.append("email", email);
		if (password) {
			formData.append("password", password);
			formData.append("password_confirmation", passwordConfirmation);
		}
		if (avatar) {
			formData.append("avatar", avatar);
		}

		formData.append('_method', 'PUT'); // Указываем, что это PUT-запрос

		// for (const [key, value] of formData.entries()) {
		//     console.log(key, value);
		// }

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
{
	avatarPreview?<Avatar src={avatarPreview}/>:<AvatarSvg isUser={true}/>

}

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
