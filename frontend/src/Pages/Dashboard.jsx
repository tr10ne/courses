import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Components/UserContext.jsx";

const Dashboard = () => {
	const { user } = useContext(UserContext);

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
							>
								Отзывы
							</Link>
						</li>
						<li>
							<Link
								to="/user/profile"
							>
								Профиль
							</Link>
						</li>

						{user?.role === "admin" && (
							<>
								<li>
									<Link
										to="/user/schools"
									>
										Школы
									</Link>
								</li>
								<li>
									<Link
										to="/user/users"
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