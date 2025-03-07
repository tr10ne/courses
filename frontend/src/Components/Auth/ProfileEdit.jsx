import React, { useState, useEffect, useContext } from "react";
import { apiUrl } from "../../js/config";
import { UserContext } from "../UserContext";
import Avatar from "./Avatar";
import AvatarSvg from "./AvatarSvg";
import Cross from "../Cross";

const ProfileEdit = () => {
	const { user, setUser } = useContext(UserContext);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [avatar, setAvatar] = useState(null);
	const [avatarPreview, setAvatarPreview] = useState("");
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		if (!user) return;
		setName(user.name || "");
		setEmail(user.email || "");
		setUserId(user.id);
		if (user.avatar) setAvatarPreview(apiUrl + user.avatar);
	}, [user]);

	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setAvatar(file);
			setAvatarPreview(URL.createObjectURL(file));
		}
	};
	const handleAvatarDelete = (e) => {
		e.preventDefault();
		setAvatar(null);
		setAvatarPreview(null);
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
				if(data.data.avatar)
				setAvatarPreview(apiUrl + data.data.avatar );
				if (avatarPreview) {
					URL.revokeObjectURL(avatarPreview); // Очищаем старый URL
				}
			} else {
				alert(data.data.message || "Ошибка при обновлении профиля");
			}
		} catch (error) {
			console.error("Ошибка:", error);
		}
	};

	useEffect(() => {
		return () => {
			// Очищаем объект URL при размонтировании компонента
			if (avatarPreview) {
				URL.revokeObjectURL(avatarPreview);
			}
		};
	}, [avatarPreview]);

	return (
		<div className="container auth">
			<h1 className="title auth__title">Редактирование профиля</h1>
			<form
				onSubmit={handleSubmit}
				className="auth__form"
				// encType="multipart/form-data"
			>
				<div className="auth__form__group">
					<label className="auth__form__label">
						Имя:
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
						Электронная почта:
						<input
							autoComplete="email"
							type="email"
							className="auth__form__input"
							value={email || ""}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</label>
				</div>
				<div className="auth__form__group">
					<label className="auth__form__label">
						Пароль:
						<input
							type="password"
							className="auth__form__input"
							value={password || ""}
							onChange={(e) => setPassword(e.target.value)}
							minLength="8"
							placeholder="Минимум 8 символов"
							autoComplete="new-password"
						/>
					</label>
				</div>
				<div className="auth__form__group">
					<label className="auth__form__label">
						Подтверждение пароля:
						<input
							type="password"
							className="auth__form__input"
							autoComplete="new-password"
							value={passwordConfirmation || ""}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							minLength="8"
						/>
					</label>
				</div>
				<div className="auth__form__group auth__form__group_avatar">
					<label tabindex="0" className="avatar-label">
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
		</div>
	);
};

export default ProfileEdit;
