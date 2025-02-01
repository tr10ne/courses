<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    // Получить все категории
    public function index()
    {
        return Category::all();
    }

    // Создать новую категорию
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:categories',
            'url' => 'nullable|string',
        ]);

        return Category::create($request->all());
    }

    // Получить одну категорию по ID
    public function show($id)
    {
        return new CategoryResource(Category::findOrFail($id));
    }

    // Обновить категорию
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|unique:categories,name,' . $category->id,
            'url' => 'nullable|string',
        ]);

        $category->update($request->all());

        return $category;
    }

    // Удалить категорию
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->noContent();
    }
    public function getSubcategories($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Получаем подкатегории
        $subcategories = $category->subcategories;

        return response()->json($subcategories);
    }
}