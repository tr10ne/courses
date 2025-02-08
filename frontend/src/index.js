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

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(
    // <React.StrictMode>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <App>
                <Outlet />{" "}
              </App>
            }
          >
            <Route index element={<Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="schools" element={<Schools />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="users" element={<Users />} />
            <Route path="courses/:url" element={<CourseDetail />} />
            <Route path="school/:url" element={<SchoolDetail />} />
          </Route>
        </Routes>
      </Router>
    //  </React.StrictMode>
  );
}
