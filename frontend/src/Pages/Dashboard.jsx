import React, { useContext } from "react";
import { Link,  useLocation } from "react-router-dom";
import { UserContext } from "../Components/UserContext.jsx";

const Dashboard = () => {
	const { user } = useContext(UserContext);
	const location = useLocation();

	const isActive = (path) => location.pathname === path;

	return (
		<div className="dashboard container">
            <div>

            <h1 className="title" >Личный кабинет</h1>
           {user&& <p className="auth__desc">Добро пожаловать, {user.name}</p>}
            </div>
		<nav>
					<ul>
                    <li>
							<Link
								to="/user/reviews"
								// className={isActive("/user/reviews") ? "active" : ""}
							>
								Отзывы
							</Link>
						</li>
						<li>
							<Link
								to="/user/profile"
								// className={isActive("/user/profile") ? "active" : ""}
							>
								Профиль
							</Link>
						</li>

						{user?.role === "admin" && (
							<>
								<li>
									<Link
										to="/user/schools"
										// className={isActive("/user/schools") ? "active" : ""}
									>
										Школы
									</Link>
								</li>
								<li>
									<Link
										to="/user/users"
										// className={isActive("/user/users") ? "active" : ""}
									>
										Пользователи
									</Link>
								</li>
							</>
						)}
						{user?.role === "school_representative" && (
							<li>
								<Link
									to="/user/school"
									// className={isActive("/user/school") ? "active" : ""}
								>
									Школа
								</Link>
							</li>
						)}
					</ul>
				</nav>
		</div>
	);
};

export default Dashboard;