<?php

namespace App\Http\Controllers;

use App\Models\Subcategory;
use Illuminate\Http\Request;

class SubcategoryController extends Controller
{
    // Получить все подкатегории
    public function index()
    {
        return Subcategory::all();
    }

    // Создать новую подкатегорию
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string',
            'url' => 'nullable|string',
            'link' => 'required|string',
        ]);

        return Subcategory::create($request->all());
    }

    // Получить одну подкатегорию по ID
    public function show($id)
    {
        return Subcategory::findOrFail($id);
    }

    // Обновить подкатегорию
    public function update(Request $request, $id)
    {
        $subcategory = Subcategory::findOrFail($id);

        $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'name' => 'sometimes|required|string',
            'url' => 'nullable|string',
            'link' => 'sometimes|required|string',
        ]);

        $subcategory->update($request->all());

        return $subcategory;
    }

    // Удалить подкатегорию
    public function destroy($id)
    {
        $subcategory = Subcategory::findOrFail($id);
        $subcategory->delete();

        return response()->noContent();
    }
}