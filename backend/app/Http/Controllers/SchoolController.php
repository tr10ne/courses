<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;
use App\Http\Resources\SchoolResource;

class SchoolController extends Controller
{
    // Метод для получения всех школ
    public function index()
    {
        // Возвращаем коллекцию всех школ с использованием ресурса
        return SchoolResource::collection(School::all());
    }

    // Метод для создания новой школы
    public function store(Request $request)
    {
        // Валидация данных запроса
        $validatedData = $request->validate([
            'name' => 'required|string|unique:schools, name', // Название школы обязательно и уникально
            'description' => 'required|string', // Описание школы обязательно
            'url' => 'required|string|unique:schools,url', // URL школы обязателен и уникален
            'link' => 'nullable|string', // Ссылка на школу (не обязательна)
            'link_to_school' => 'nullable|string' //Ссылка на оригинальную страницу школы (не обязательна, если есть должна быть уникальна)
        ]);

        // Создаем новую школу с валидированными данными
        $school = School::create($validatedData);
        // Возвращаем созданную школу в виде ресурса
        return new SchoolResource($school);
    }

    // Метод для получения школы по ID
    public function show($id)
    {
        // Находим школу по ID и возвращаем её в виде ресурса
        return new SchoolResource(School::findOrFail($id));
    }

    // Метод для обновления существующей школы
    public function update(Request $request, $id)
    {
        // Находим школу по ID
        $school = School::findOrFail($id);

        // Валидация данных запроса
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|unique:schools,name' . $school->id, // Название школы (можно обновить, но должно оставаться уникальным)
            'description' => 'sometimes|required|string', // Описание школы (можно обновить)
            'url' => 'sometimes|required|string|unique:schools,url' . $school->id, // URL (обязательно и должно быть уникальным)
            'link' => 'sometimes|nullable|string', // Ссылка (можно обновить)
            'link_to_school' => 'sometimes|nullable|string', //Ссылка на оригинальную страницу школы (можно обновить, не обязательна, но уникальна)
        ]);

        // Обновляем данные школы
        $school->update($validatedData);
        // Возвращаем обновленную школу в виде ресурса
        return new SchoolResource($school);
    }

    // Метод для удаления школы
    public function destroy($id)
    {
        // Находим школу по ID и удаляем её
        $school = School::findOrFail($id);
        $school->delete();
        // Возвращаем успешный ответ без контента
        return response()->noContent();
    }

    // Метод для получения школы по URL
    public function showByUrl($url)
    {
        // Находим школу по URL и возвращаем её в виде ресурса
        $school = School::where('url', $url)->firstOrFail();
        return new SchoolResource($school);
    }
}
