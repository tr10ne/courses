<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Http\Resources\RoleResource;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    // Метод для получения всех ролей
    public function index()
    {
        // Возвращаем коллекцию всех ролей с использованием ресурса
        return RoleResource::collection(Role::all());
    }

    // Метод для создания новой роли
    public function store(Request $request)
    {
        // Валидация данных запроса
        $validatedData = $request->validate([
            'name' => 'required|string|unique:roles', // Название роли обязательно и уникально
        ]);

        // Создаем новую роль с валидированными данными
        $role = Role::create($validatedData);
        // Возвращаем созданную роль в виде ресурса
        return new RoleResource($role);
    }

    // Метод для получения роли по ID
    public function show($id)
    {
        // Находим роль по ID и возвращаем её в виде ресурса
        return new RoleResource(Role::findOrFail($id));
    }

    // Метод для обновления существующей роли
    public function update(Request $request, $id)
    {
        // Находим роль по ID
        $role = Role::findOrFail($id);

        // Валидация данных запроса
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|unique:roles,name,' . $role->id, // Название роли (можно обновить, но должно оставаться уникальным)
        ]);

        // Обновляем данные роли
        $role->update($validatedData);
        // Возвращаем обновленную роль в виде ресурса
        return new RoleResource($role);
    }

    // Метод для удаления роли
    public function destroy($id)
    {
        // Находим роль по ID и удаляем её
        $role = Role::findOrFail($id);
        $role->delete();
        // Возвращаем успешный ответ без контента
        return response()->noContent();
    }
}
