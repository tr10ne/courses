<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    // Метод для получения списка всех категорий
    public function index()
    {
        // Возвращаем все категории в виде коллекции ресурса
        return CategoryResource::collection(Category::all());
    }

    // Метод для создания новой категории
    public function store(Request $request)
    {
        // Валидация данных запроса
        $request->validate([
            'name' => 'required|string|unique:categories,name', // Имя категории обязательно и должно быть уникальным
            'url' => 'required|string|unique:categories,url', // URL категории обязателен и должен быть уникальным
        ]);

        // Создание новой категории с переданными данными
        $category = Category::create($request->all());
        // Возвращаем созданную категорию в виде ресурса
        return new CategoryResource($category);
    }

    // Метод для получения категории по её идентификатору
    public function show($id)
    {
        // Находим категорию по ID, если не найдено - будет ошибка 404
        return new CategoryResource(Category::findOrFail($id));
    }

    // Метод для обновления существующей категории
    public function update(Request $request, $id)
    {
        // Находим категорию по ID, если не найдено - будет ошибка 404
        $category = Category::findOrFail($id);

        // Валидация данных запроса
        $request->validate([
            'name' => 'sometimes|required|string|unique:categories,name,' . $category->id, // Имя может быть изменено, но должно оставаться уникальным
            'url' => 'sometimes|required|string|unique:categories,url,' . $category->id, // URL категории обязателен и должен оставаться уникальным
        ]);
        

        // Обновление категории с новыми данными
        $category->update($request->all());
        // Возвращаем обновлённую категорию в виде ресурса
        return new CategoryResource($category);
    }

    // Метод для удаления категории по её идентификатору
    public function destroy($id)
    {
        // Находим категорию по ID, если не найдено - будет ошибка 404
        $category = Category::findOrFail($id);
        // Удаляем категорию
        $category->delete();

        // Возвращаем ответ без содержимого (204)
        return response()->noContent();
    }

    // Метод для получения подкатегорий по идентификатору категории
    public function getSubcategories($id)
    {
        // Находим категорию по ID
        $category = Category::find($id);

        // Если категория не найдена, возвращаем ошибку 404
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Получаем все подкатегории данной категории
        $subcategories = $category->subcategories;

        // Возвращаем подкатегории в формате JSON
        return response()->json($subcategories);
    }

    // Метод для получения категории по её URL
    public function showByUrl($url)
    {
        // Находим категорию по URL, если не найдено - будет ошибка 404
        $category = Category::where('url', $url)->firstOrFail();
        // Возвращаем категорию в виде ресурса
        return new CategoryResource($category);
    }
}
