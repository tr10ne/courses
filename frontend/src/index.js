import React from "react";
import { createRoot } from "react-dom/client";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Outlet,
} from "react-router-dom";
import App from "./App"; // Импортируем App как Layout
import Home from "./Pages/Home";
import Courses from "./Pages/Courses"; // Импортируем компонент Courses
import Schools from "./Pages/Schools"; // Импортируем компонент Schools
import Reviews from "./Pages/Reviews"; // Импортируем компонент Reviews
import Users from "./Pages/Users"; // Импортируем компонент Users
import CourseDetail from "./Pages/CourseDetail"; // Импортируем компонент CourseDetail
import SchoolDetail from "./Pages/SchoolDetail"; // Импортируем компонент SchoolDetail
import SchoolReviews from "./Pages/SchoolReviews";
import ScrollToTop from "./Components/ScrollToTop";

import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import ProfileEdit from "./Components/Auth/ProfileEdit";
import PrivateRoute from "./Components/Auth/PrivateRoute";
import NotFound from "./Components/NotFound/NotFound";

import UserReviews from "./Pages/UserReviews";

const container = document.getElementById("root");

if (container) {
	const root = createRoot(container);
	root.render(
		<Router>
			<ScrollToTop />
			<Routes>
				<Route
					path="/"
					element={
						<App>
							<Outlet />
						</App>
					}
				>
					<Route index element={<Home />} />
					<Route path="courses" element={<Courses />} />
					<Route path="schools" element={<Schools />} />
					<Route path="reviews" element={<Reviews />} />
					<Route path="users" element={<Users />} />
					{/* <Route path="courses/:url" element={<CourseDetail />} /> */}
					<Route path="schools/:url" element={<SchoolDetail />} />
					<Route path="schools/:url/reviews" element={<SchoolReviews />} />
					<Route path="/courses/:categoryUrl" element={<Courses />} />
					<Route
						path="/courses/:categoryUrl/:subcategoryUrl"
						element={<Courses />}
					/>
					<Route
						path="/courses/:categoryUrl/:subcategoryUrl/:courseUrl"
						element={<CourseDetail />}
					/>
					{/* Публичные маршруты */}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					{/* Защищенные маршруты */}
					<Route
						path="/user/profile"
						element={
							<PrivateRoute>
								<ProfileEdit />
							</PrivateRoute>
						}
					/>
						<Route
							path="/user/reviews"
							element={
								<PrivateRoute>
									<UserReviews />
								</PrivateRoute>
							}
						/>
						<Route
							path="/user/schools"
							element={
								<PrivateRoute>
									<UserReviews />
								</PrivateRoute>
							}
						/>
					<Route
						path="/users"
						element={
							<PrivateRoute>
								<Users />
							</PrivateRoute>
						}
					/>

					{/* Другие маршруты */}
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</Router>
	);
}
