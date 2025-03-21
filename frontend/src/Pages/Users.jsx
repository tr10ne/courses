import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../js/config.js";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/users`)
      .then((response) => {
        console.log("Ответ от API:", response.data);

        const result = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.data)
          ? response.data.data
          : null;

        if (Array.isArray(result)) {
          setUsers(result);
        } else {
          console.error("Ожидался массив, но получено:", result);
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке пользователей:", error);
      });
  }, []);

  return (
    <div>
      <h1>Список пользователей</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Роль</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) &&
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role ? user.role.name : "Нет роли"}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
