<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Получить всех пользователей
    public function index()
    {
        return User::with('role')->get(); // Загружаем связанные роли
    }

    // Создать нового пользователя
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role_id' => $request->role_id,
        ]);

        return new UserResource($user);
    }

    // Получить одного пользователя по ID
    public function show($id)
    {
        $user = User::with('role')->findOrFail($id); // Загружаем связанную роль
        return new UserResource($user);
    }

    // Обновить пользователя
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string',
            'email' => 'sometimes|required|string|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|required|string|min:8',
            'role_id' => 'sometimes|required|exists:roles,id',
        ]);

        $user->update($request->all());

        return new UserResource($user);
    }

    // Удалить пользователя
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->noContent();
    }
}