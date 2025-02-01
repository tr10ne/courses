<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Http\Resources\RoleResource;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    // Получить все роли
    public function index()
    {
        $roles = Role::all();
        return RoleResource::collection($roles);
    }

    // Создать новую роль
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles',
            'description' => 'nullable|string',
        ]);

        $role = Role::create($request->all());

        return new RoleResource($role);
    }

    // Получить одну роль по ID
    public function show($id)
    {
        $role = Role::findOrFail($id);
        return new RoleResource($role);
    }

    // Обновить роль
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|unique:roles,name,' . $role->id,
            'description' => 'nullable|string',
        ]);

        $role->update($request->all());

        return new RoleResource($role);
    }

    // Удалить роль
    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->noContent();
    }
}