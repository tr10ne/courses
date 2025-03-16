import React, { useState, useContext } from "react";
import axios from "axios";
import { apiUrl } from "../../js/config.js";
import { UserContext } from "../UserContext.jsx";
import { validateEmail, validatePasswordLenght } from "../../js/utils.js";
import Eye from "../Eye.jsx";
import Modal from "../Modal";

const Login = ({ onAuthSuccess, isModal = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { setUser } = useContext(UserContext);
  const [modalProps, setModalProps] = useState({
    isOpen: false,
    title: "",
    message: "",
    buttonText: "Закрыть",
  });

  //=======================================================
  //ОБЩИЕ ФУНКЦИИ

  // Проверка, для активации кнопки "Войти"

  const isFormValid = () => {
    return validateEmail(email) && validatePasswordLenght(password);
  };

  //================================================================
  // РАБОТА С ЗАПРОСОМ

  //запрос на вход пользователя

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    try {
      const response = await axios.post(`${apiUrl}/api/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);

        if (isModal && onAuthSuccess && typeof onAuthSuccess === "function") {
          await onAuthSuccess();
        } else {
          window.location.href = "/user/profile";
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { type, message } = error.response.data;

        if (type === "email") {
          setEmailError(message);
        } else if (type === "password") {
          setPasswordError(message);
        } else {
          setModalProps({
            isOpen: true,
            title: "Ошибка",
            message: message,
            buttonText: "Понял",
          });
        }
      } else {
        setModalProps({
          isOpen: true,
          title: "Ошибка",
          message: "Произошла ошибка при авторизации",
          buttonText: "Хорошо",
        });
      }
    }
  };

  return (
    <div className={`container auth ${isModal ? "modal-login" : ""}`}>
      <h1 className="title auth__title">
        {isModal ? "Войдите" : "Авторизация"}
      </h1>
      <p className="desc auth__desc">
        {isModal ? "Чтобы оставить отзыв" : "Вход в личный кабинет"}
      </p>
      <form className="auth__form" onSubmit={handleSubmit}>
        <div className="auth__form__group">
          <label className="auth__form__label">
            <span>
              Email:
              {emailError && <span className="auth__error">{emailError}</span>}
            </span>
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
            <span>
              Пароль:
              {passwordError && (
                <span className="auth__error">{passwordError}</span>
              )}
            </span>
            <div className="password-input-wrapper">
              <input
                className="auth__form__input"
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
        <button type="submit" className="link-btn" disabled={!isFormValid()}>
          {isModal ? "Войти" : "Авторизоваться"}
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

export default Login;
