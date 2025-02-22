<?php

namespace App\Http\Controllers;

use App\Models\Subcategory;
use Illuminate\Http\Request;
use App\Http\Resources\SubcategoryResource;

class SubcategoryController extends Controller
{
    // Метод для получения всех подкатегорий
    public function index()
    {
        // Возвращаем коллекцию всех подкатегорий с использованием ресурса
        return SubcategoryResource::collection(Subcategory::all());
    }

    // Метод для создания новой подкатегории
    public function store(Request $request)
    {
        // Валидация данных запроса
        $validatedData = $request->validate([
            'category_id' => 'required|exists:categories,id', // ID категории, к которой относится подкатегория
            'name' => 'required|string', // Название подкатегории обязательно
            'url' => 'required|string|unique:subcategories,url', // URL должен быть уникальным для всех подкатегорий
            'link' => 'nullable|string', // Ссылка на подкатегорию (не обязательное поле)
        ]);

        // Создаем новую подкатегорию с валидированными данными
        $subcategory = Subcategory::create($validatedData);
        // Возвращаем созданную подкатегорию в виде ресурса
        return new SubcategoryResource($subcategory);
    }

    // Метод для получения подкатегории по ID
    public function show($id)
    {
        // Находим подкатегорию по ID и возвращаем её в виде ресурса
        return new SubcategoryResource(Subcategory::findOrFail($id));
    }

    // Метод для обновления существующей подкатегории
    public function update(Request $request, $id)
    {
        // Находим подкатегорию по ID
        $subcategory = Subcategory::findOrFail($id);

        // Валидация данных запроса
        $validatedData = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id', // ID категории (можно обновить)
            'name' => 'sometimes|required|string', // Название (можно обновить)
            'url' => 'sometimes|required|string|unique:subcategories,url' . $subcategory->$id, // URL (должно оставаться уникальным и обязательным)
            'link' => 'sometimes|nullable|string', // Ссылка (не обязательное поле)
        ]);

        // Обновляем данные подкатегории
        $subcategory->update($validatedData);
        // Возвращаем обновленную подкатегорию в виде ресурса
        return new SubcategoryResource($subcategory);
    }

    // Метод для удаления подкатегории
    public function destroy($id)
    {
        // Находим подкатегорию по ID и удаляем её
        $subcategory = Subcategory::findOrFail($id);
        $subcategory->delete();
        // Возвращаем успешный ответ без контента
        return response()->noContent();
    }

    // Метод для получения подкатегории по URL
    public function showByUrl($url)
    {
        // Находим подкатегорию по URL и возвращаем её в виде ресурса
        $subcategory = Subcategory::where('url', $url)->firstOrFail();

        if (!$subcategory) {
            return response()->json(['message' => 'Subcategory not found'], 404);
        }

        return new SubcategoryResource($subcategory);
    }
}
