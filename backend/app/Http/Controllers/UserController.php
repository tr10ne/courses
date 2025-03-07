<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
            'password' => 'required|string|min:8|confirmed', // Пароль должен быть не короче 8 символов и подтвержден
            'role_id' => 'sometimes|exists:roles,id', // Роль пользователя должна существовать в базе, если передана
        ]);

        Log::info('password', ['pass' => $validatedData['password']]);

        // Хешируем пароль перед сохранением
        $validatedData['password'] = Hash::make($validatedData['password']);

        // Автоматическое заполнение role_id, если оно не передано
        if (!isset($validatedData['role_id'])) {
            $validatedData['role_id'] = 3; // Например, роль по умолчанию (обычный пользователь)
        }

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

    public function update($id, Request $request)
{
    $user = User::findOrFail($id);

    Log::info('Update user', ['user_id' => $id, 'request_data' => $request->all()]);

    // Валидация данных запроса для обновления
    $validatedData = $request->validate([
        'name' => 'sometimes|required|string',
        'email' => 'sometimes|required|string|email|unique:users,email,' . $user->id,
        'password' => 'sometimes|required|string|min:8',
        'role_id' => 'sometimes|required|exists:roles,id',
        'avatar' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    // Если пароль обновляется, хешируем новый пароль
    if (isset($validatedData['password'])) {
        $validatedData['password'] = Hash::make($validatedData['password']);
    }

    // Обработка загрузки аватара
    if ($request->hasFile('avatar')) {
        // Удаляем старый аватар, если он существует
        if ($user->avatar && Storage::exists($user->avatar)) {
            Storage::delete($user->avatar);
        }

        // Сохраняем новый аватар
        $avatarPath = $request->file('avatar')->store('public/images/users/avatars');
        $validatedData['avatar'] = str_replace('public/', '/storage/', $avatarPath); 
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

    public function login(Request $request)
    {
        // Валидация данных запроса
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Поиск пользователя по email с загрузкой связи role
        $user = User::with('role')->where('email', $credentials['email'])->first();

        // Проверка пароля
        if ($user && Hash::check($credentials['password'], $user->password)) {
            // Создание токена
            $token = $user->createToken('authToken')->plainTextToken;

            // Возвращаем токен и информацию о пользователе
            return response()->json([
                'token' => $token,
                'user' => new UserResource($user),
            ]);
        }

        // Попытка аутентификации
        // if (Auth::attempt($credentials)) {
        //     $user = Auth::user();
        //     $token = $user->createToken('authToken')->plainTextToken;

        //     // Возвращаем токен и информацию о пользователе
        //     return response()->json([
        //         'token' => $token,
        //         'user' => new UserResource($user),
        //     ]);
        // }

        // Если аутентификация не удалась
        return response()->json(['message' => 'Неверные учетные данные'], 401);
    }
}
