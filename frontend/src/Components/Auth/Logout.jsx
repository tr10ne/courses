import { useContext } from "react";
import { UserContext } from "../UserContext";

const useLogout = () => {
  const { setUser } = useContext(UserContext);

  const handleLogout = () => {
    // Удаляем токен из localStorage
    localStorage.removeItem("token");

    // Очищаем данные пользователя в контексте
    setUser(null);

    // Проверяем, находится ли пользователь внутри ЛК
    if (window.location.pathname.startsWith("/user")) {
      // Перенаправляем на страницу входа
      window.location.href = "/login";
    } else {
      // Просто перезагружаем текущую страницу
      window.location.reload();
    }
  };

  return handleLogout;
};

export default useLogout;
