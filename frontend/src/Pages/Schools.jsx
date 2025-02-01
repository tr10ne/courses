import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Schools = () => {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/schools")
      .then((response) => {
        console.log("Ответ от API:", response.data); // Проверьте структуру данных

        // Предполагаем, что ответ содержит массив школ напрямую
        if (Array.isArray(response.data)) {
          setSchools(response.data);
        } else {
          console.error("Ожидался массив, но получено:", response.data);
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке школ:", error);
      });
  }, []);

  return (
    <div>
      <h1>Список школ</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(schools) &&
            schools.map((school) => (
              <tr key={school.id}>
                <td>{school.id}</td>
                <td>
                  <Link to={`/school/${school.url}`}>{school.name}</Link>
                </td>
                <td>
                  <div
                    dangerouslySetInnerHTML={{ __html: school.description }}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schools;
