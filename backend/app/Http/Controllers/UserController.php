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
            'email' => 'required|string|email', // Почта пользователя уникальна
            'password' => 'required|string|min:8|confirmed', // Пароль должен быть не короче 8 символов и подтвержден
            'role_id' => 'sometimes|exists:roles,id', // Роль пользователя должна существовать в базе, если передана
        ]);


        $user = User::with('role')->where('email', $validatedData['email'])->first();

        if ($user) {
            return response()->json(['type' => 'email', 'message' => 'Пользователь с таким email уже зарегистрирован'], 401);
        }

        // Хешируем пароль перед сохранением
        $validatedData['password'] = Hash::make($validatedData['password']);

        // Автоматическое заполнение role_id, если оно не передано
        if (!isset($validatedData['role_id'])) {
            $validatedData['role_id'] = 3;
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
        // Log::info('Update user', ['user_id' => $id, 'request_data' => $request->all()]);

        if ($request->input('avatar') === 'null') {
            $request->merge(['avatar' => null]);
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string',
            'email' => 'sometimes|required|string|email',
            'password' => 'sometimes|required|string|min:8',
            'role_id' => 'sometimes|required|exists:roles,id',
            'avatar' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Ищем пользователя с таким же email, исключая текущего пользователя
        $sameUser = User::with('role')
            ->where('email', $validatedData['email'])
            ->where('id', '!=', $user->id) // Исключаем текущего пользователя
            ->first();

        if ($sameUser) {
            return response()->json(['type' => 'email', 'message' => 'Пользователь с таким email уже зарегистрирован'], 401);
        }

        // Если пароль обновляется, хешируем новый пароль
        if (isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        // Обработка удаления/загрузки аватара
        if ($request->hasFile('avatar')) {
            $this->removeAvatar($user);

            // Сохраняем новый аватар
            $avatarPath = $request->file('avatar')->store('public/images/users/avatars');
            $validatedData['avatar'] = str_replace('public/', '/storage/', $avatarPath);
        } elseif ($request->input('avatar') === null) {
            $this->removeAvatar($user);
            $validatedData['avatar'] = null;
        }
        // Обновляем данные пользователя
        $user->update($validatedData);

        // Возвращаем обновленного пользователя в виде ресурса
        return new UserResource($user);
    }

    //удаление аватара из БД
    public function removeAvatar(User $user)
    {
        if ($user && $user->avatar && Storage::exists(str_replace('/storage/', 'public/', $user->avatar))) {
            Storage::delete(str_replace('/storage/', 'public/', $user->avatar));

            $user->update(['avatar' => null]);
        }
    }

    // Метод для удаления пользователя
    public function destroy($id)
    {
        // Находим пользователя по ID и удаляем его
        $user = User::findOrFail($id);
        $this->removeAvatar($user);
        $user->delete();
        // Возвращаем успешный ответ без контента
        return response()->noContent();
    }

    public function login(Request $request)
    {
        // Валидация данных запроса
        $validatedData = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Поиск пользователя по email с загрузкой связи role
        $user = User::with('role')->where('email', $validatedData['email'])->first();

        if (!$user) {
            return response()->json(['type' => 'email', 'message' => 'Пользователь с таким email не зарегистрирован'], 401);
        }

        // Проверка пароля
        if (!Hash::check($validatedData['password'], $user->password)) {
            return response()->json(['type' => 'password', 'message' => 'Неверный пароль'], 401);
        }

        // Создание токена
        $token = $user->createToken('authToken')->plainTextToken;

        // Возвращаем токен и информацию о пользователе
        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }
}
