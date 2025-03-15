import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AvatarSvg from "../Auth/AvatarSvg";
import Avatar from "../Auth/Avatar";
import { apiUrl } from "../../js/config";
import { UserContext } from "../UserContext";
import useLogout from "../Auth/Logout";

const Auth = ({
  handleAuthIconClick,
  authDropdownRef,
  authDropdownMenuRef,
}) => {
  const { user } = useContext(UserContext);
  const [avatar, setAvatar] = useState("");
  const handleLogout = useLogout();

  // Загрузка данных текущего пользователя
  useEffect(() => {
    if (user && user.avatar) {
      setAvatar(apiUrl + user.avatar);
    } else {
      setAvatar(null); // Очищаем состояние, если аватара нет
    }
  }, [user]);

  //=======================================================
  //ОТРИСОВКА ЭЛЕМЕНТОВ

  return (
    <div className="auth-dropdown" ref={authDropdownRef}>
      <button className="auth-icon" onClick={handleAuthIconClick}>
        {avatar ? <Avatar src={avatar} /> : <AvatarSvg isUser={user} />}
      </button>
      <div className={`auth-dropdown-menu `} ref={authDropdownMenuRef}>
        {user ? (
          <>
            <Link
              to="/user/profile"
              className="auth-dropdown-item"
              onClick={handleAuthIconClick}
            >
              Профиль
            </Link>
            <Link
              to="/user/reviews"
              className="auth-dropdown-item"
              onClick={handleAuthIconClick}
            >
              Отзывы
            </Link>
            {/* <Link
							to="/settings"
							className="auth-dropdown-item"
							onClick={handleAuthIconClick}
						>
							Настройки
						</Link> */}
            <button className="auth-dropdown-item" onClick={handleLogout}>
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="auth-dropdown-item"
              onClick={handleAuthIconClick}
            >
              Войти
            </Link>
            <Link
              to="/register"
              className="auth-dropdown-item"
              onClick={handleAuthIconClick}
            >
              Зарегистрироваться
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
