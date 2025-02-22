import React from "react";
import { Link } from "react-router-dom";

const Auth = ({
	user,
	isAuthDropdownOpen,
	handleAuthIconClick,
	authDropdownRef,
}) => {
	return (
		<div className="auth-dropdown" ref={authDropdownRef}>
			<button className="auth-icon" onClick={handleAuthIconClick}>
				{user ? (
					<img
						src={user.avatar || "/images/avatar-default.png"}
						alt="User Avatar"
						className="auth-avatar"
					/>
				) : (
					<svg viewBox="0 0 24 24" className="auth-icon-svg">
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
					</svg>
				)}
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
									localStorage.removeItem("remember_token");
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
