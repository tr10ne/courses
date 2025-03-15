import React, { useState, useContext } from "react";
import { apiUrl } from "../../js/config.js";
import {
  validateEmail,
  validateNameLenght,
  validatePasswordLenght,
  preventSpaceKeyInput,
} from "../../js/utils.js";
import { UserContext } from "../UserContext.jsx";
import Eye from "../Eye.jsx";
import Modal from "../Modal";

const Register = ({ onAuthSuccess, isModal = false }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [emailError, setEmailError] = useState("");
  const { setUser } = useContext(UserContext);
  const [modalProps, setModalProps] = useState({
    isOpen: false,
    title: "",
    message: "",
    buttonText: "Закрыть",
  });

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
      // Регистрация пользователя
      const registerResponse = await fetch(`${apiUrl}/api/register`, {
        method: "POST",
        body: formData,
      });
      const registerData = await registerResponse.json();

      if (registerResponse.ok) {
        // Автоматическая авторизация после регистрации
        try {
          const loginResponse = await fetch(`${apiUrl}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });
          const loginData = await loginResponse.json();

          if (loginResponse.ok && loginData.token && loginData.user) {
            // Сохраняем токен и пользователя
            localStorage.setItem("token", loginData.token);
            setUser(loginData.user);

            // Успешная регистрация и авторизация
            // setModalProps({
            //   isOpen: true,
            //   title: "Успех!",
            //   message: isModal
            //     ? "Успешная регистрация. Теперь вы можете оставить отзыв."
            //     : "Успешная регистрация. Вы будете перенаправлены на страницу входа.",
            //   buttonText: "Хорошо",
            // });

            // Если это модальный вариант, вызываем onAuthSuccess для отправки отзыва
            if (isModal && onAuthSuccess) {
              onAuthSuccess(); // Вызываем сразу без задержки
            } else {
              window.location.href = "/user/profile"; // Перенаправление на профиль
            }
          } else {
            console.error("Ошибка автоматического входа:", loginData);
          }
        } catch (loginError) {
          console.error("Ошибка при автоматическом входе:", loginError);
        }
      } else {
        const { type, message } = registerData;
        if (type === "email") {
          setEmailError(message);
        } else {
          setModalProps({
            isOpen: true,
            title: "Ошибка",
            message: message,
            buttonText: "Понял",
          });
        }
      }
    } catch (error) {
      setModalProps({
        isOpen: true,
        title: "Ошибка",
        message: "Произошла ошибка при регистрации",
        buttonText: "Хорошо",
      });
    }
  };

  return (
    <div className={`container auth ${isModal ? "modal-register" : ""}`}>
      <h1 className="title auth__title">
        {isModal ? "Зарегистрируйтесь" : "Регистрация"}
      </h1>
      <p className="desc auth__desc">
        {isModal ? "Чтобы оставить отзыв" : "Создание аккаунта"}
      </p>
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
      {modalProps.isOpen && (
        <Modal
          isOpen={modalProps.isOpen}
          onClose={() => setModalProps({ ...modalProps, isOpen: false })}
          title={modalProps.title}
          message={modalProps.message}
          buttonText={modalProps.buttonText}
          onButtonClick={() => setModalProps({ ...modalProps, isOpen: false })}
        />
      )}
    </div>
  );
};

export default Register;
