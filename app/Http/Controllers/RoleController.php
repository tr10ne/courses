<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        return Inertia::render('Roles/Index', [
            'roles' => $roles,
        ]);
    }

    public function create()
    {
        return Inertia::render('Roles/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'role_name' => 'required|unique:roles|max:50',
        ]);

        Role::create($request->all());

        return redirect()->route('roles.index')
                         ->with('success', 'Role created successfully.');
    }

    public function show(Role $role)
    {
        return Inertia::render('Roles/Show', [
            'role' => $role,
        ]);
    }

    public function edit(Role $role)
    {
        return Inertia::render('Roles/Edit', [
            'role' => $role,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'role_name' => 'required|unique:roles|max:50',
        ]);

        $role->update($request->all());

        return redirect()->route('roles.index')
                         ->with('success', 'Role updated successfully');
    }

    public function destroy(Role $role)
    {
        $role->delete();

        return redirect()->route('roles.index')
                         ->with('success', 'Role deleted successfully');
    }
}
