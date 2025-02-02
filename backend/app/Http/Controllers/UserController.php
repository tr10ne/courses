<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    // Метод для получения всех пользователей с их ролью
    public function index()
    {
        // Возвращаем коллекцию пользователей, загружая связанные роли
        return UserResource::collection(User::with('role')->get());
    }

    // Метод для создания нового пользователя
    public function store(Request $request)
    {
        // Валидация данных запроса
        $validatedData = $request->validate([
            'name' => 'required|string', // Имя пользователя обязательно
            'email' => 'required|string|email|unique:users,email', // Почта пользователя уникальна
            'password' => 'required|string|min:8', // Пароль должен быть не короче 8 символов
            'role_id' => 'required|exists:roles,id', // Роль пользователя должна существовать в базе
        ]);

        // Хешируем пароль перед сохранением
        $validatedData['password'] = Hash::make($validatedData['password']);

        // Создаем нового пользователя с валидированными данными
        $user = User::create($validatedData);
        // Возвращаем созданного пользователя в виде ресурса
        return new UserResource($user);
    }

    // Метод для получения информации о пользователе по ID
    public function show($id)
    {
        // Находим пользователя по ID и возвращаем его с ролью в виде ресурса
        return new UserResource(User::with('role')->findOrFail($id));
    }

    // Метод для обновления информации о пользователе
    public function update(Request $request, $id)
    {
        // Находим пользователя по ID
        $user = User::findOrFail($id);

        // Валидация данных запроса для обновления
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string', // Имя пользователя (можно обновить)
            'email' => 'sometimes|required|string|email|unique:users,email' . $user->id, // Почта (можно обновить)
            'password' => 'sometimes|required|string|min:8', // Пароль (можно обновить)
            'role_id' => 'sometimes|required|exists:roles,id', // Роль пользователя (можно обновить)
        ]);

        // Если пароль обновляется, хешируем новый пароль
        if (isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        // Обновляем данные пользователя
        $user->update($validatedData);
        // Возвращаем обновленного пользователя в виде ресурса
        return new UserResource($user);
    }

    // Метод для удаления пользователя
    public function destroy($id)
    {
        // Находим пользователя по ID и удаляем его
        $user = User::findOrFail($id);
        $user->delete();
        // Возвращаем успешный ответ без контента
        return response()->noContent();
    }
}
