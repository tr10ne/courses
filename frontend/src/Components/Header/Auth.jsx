import React from "react";
import { Link } from "react-router-dom";
import AvatarSvg from "../Auth/AvatarSvg";
import Avatar from "../Auth/Avatar";

const Auth = ({
	user,
	isAuthDropdownOpen,
	handleAuthIconClick,
	authDropdownRef,
}) => {
	return (
		<div className="auth-dropdown" ref={authDropdownRef}>
			<button className="auth-icon" onClick={handleAuthIconClick}>
				<AvatarSvg isUser={user} />
			</button>
			{isAuthDropdownOpen && (
				<div className="auth-dropdown-menu">
					{user ? (
						<>
							<Link to="/profile" className="auth-dropdown-item">
								Личный кабинет
							</Link>
							<Link to="/reviews" className="auth-dropdown-item">
								Отзывы
							</Link>
							<Link to="/settings" className="auth-dropdown-item">
								Настройки
							</Link>
							<button
								className="auth-dropdown-item"
								onClick={() => {
									localStorage.removeItem("token");
									window.location.href = "/login";
								}}
							>
								Выйти
							</button>
						</>
					) : (
						<>
							<Link to="/login" className="auth-dropdown-item">
								Войти
							</Link>
							<Link to="/register" className="auth-dropdown-item">
								Зарегистрироваться
							</Link>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default Auth;
