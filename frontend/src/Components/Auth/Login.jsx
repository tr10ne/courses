// import React, { useState } from 'react';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch('/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ email, password }),
//             });
//             const data = await response.json();
//             if (response.ok) {
//                 alert('Успешная авторизация');
//                 // Перенаправление на другую страницу или обновление состояния
//             } else {
//                 alert(data.message || 'Ошибка при авторизации');
//             }
//         } catch (error) {
//             console.error('Ошибка:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>Авторизация</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label htmlFor="email">Email</label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="password">Пароль</label>
//                     <input
//                         type="password"
//                         name="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <button type="submit">Войти</button>
//             </form>
//         </div>
//     );
// };

// export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../js/config.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Сохраняем токен
        window.location.href = '/profile'; // Перенаправляем на страницу профиля
      }
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
    }
  };

  return (
    <div>
      <h1>Авторизация</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default Login;