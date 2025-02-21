import React, { useState } from 'react';

const ProfileEdit = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

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
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('password_confirmation', passwordConfirmation);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            const response = await fetch('/profile/update', {
                method: 'PUT',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                alert('Профиль успешно обновлен');
            } else {
                alert(data.message || 'Ошибка при обновлении профиля');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    return (
        <div className="container">
            <h2 className="profile-title">Редактирование профиля</h2>
            <form onSubmit={handleSubmit} className="profile-form" encType="multipart/form-data">
                <div className="form-group">
                    <label htmlFor="name">Имя:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Электронная почта:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength="8"
                        placeholder="Минимум 8 символов"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password_confirmation">Подтверждение пароля:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password_confirmation"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        minLength="8"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="avatar" className="avatar-label">Изменить аватар:</label>
                    <img
                        className="profile-avatar"
                        id="avatarPreview"
                        src={avatarPreview || '/images/avatar-default.png'}
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
                <button type="submit" className="btn profile-btn">Сохранить изменения</button>
            </form>
        </div>
    );
};

export default ProfileEdit;