<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;
use App\Http\Resources\SchoolResource;

class SchoolController extends Controller
{
    // Метод для получения всех школ
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10); // Количество элементов на странице (по умолчанию 10)
        $categories = $request->query('categories', []); // Получаем выбранные категории

        // Если категории переданы, преобразуем их в массив
        if (!is_array($categories)) {
            $categories = explode(',', $categories);
        }

        $query = School::withCount('courses')
            ->withCount('reviews as reviews_count')
            ->with(['categories', 'subcategories'])
            ->withCasts(['avg_rating' => 'float'])
            ->selectRaw('schools.*, COALESCE((SELECT AVG(rating) FROM review_school 
                        JOIN reviews ON reviews.id = review_school.review_id 
                        WHERE review_school.school_id = schools.id), 0) as avg_rating');

        // Фильтрация по категориям, если они выбраны
        if (!empty($categories)) {
            $query->whereHas('categories', function ($q) use ($categories) {
                $q->whereIn('categories.id', $categories);
            });
        }

        $schools = $query->paginate($perPage);
    
        return SchoolResource::collection($schools)->response()->getData(true);
    }    

    // Метод для создания новой школы
    public function store(Request $request)
    {
        // Валидация данных запроса
        $validatedData = $request->validate([
            'name' => 'required|string|unique:schools,name', // Название школы обязательно и уникально
            'description' => 'required|string', // Описание школы обязательно
            'url' => 'required|string|unique:schools,url', // URL школы обязателен и уникален
            'link' => 'nullable|string', // Ссылка на школу (не обязательна)
            'link_to_school' => 'nullable|string' // Ссылка на оригинальную страницу школы (не обязательна, если есть, должна быть уникальна)
        ]);

        // Создаем новую школу с валидированными данными
        $school = School::create($validatedData);
        // Возвращаем созданную школу в виде ресурса
        return new SchoolResource($school);
    }

    // Метод для получения школы по ID
    public function show($id)
    {
        $school = School::where('id', $id)
            ->withCount('courses')
            ->withCount('reviews as reviews_count')
            ->with(['categories', 'subcategories'])
            ->withCasts(['avg_rating' => 'float'])
            ->selectRaw('schools.*, COALESCE((SELECT AVG(rating) FROM review_school 
                        JOIN reviews ON reviews.id = review_school.review_id 
                        WHERE review_school.school_id = schools.id), 0) as avg_rating')
            ->firstOrFail();

        return new SchoolResource($school);
    }

    // Метод для обновления существующей школы
    public function update(Request $request, $id)
    {
        // Находим школу по ID
        $school = School::findOrFail($id);

        // Валидация данных запроса
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|unique:schools,name,' . $school->id, // Название школы (можно обновить, но должно оставаться уникальным)
            'description' => 'sometimes|required|string', // Описание школы (можно обновить)
            'url' => 'sometimes|required|string|unique:schools,url,' . $school->id, // URL (обязательно и должно быть уникальным)
            'link' => 'sometimes|nullable|string', // Ссылка (можно обновить)
            'link_to_school' => 'sometimes|nullable|string', // Ссылка на оригинальную страницу школы (можно обновить, не обязательна, но уникальна)
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
        $school = School::where('url', $url)
            ->withCount('courses')
            ->withCount('reviews as reviews_count')
            ->with(['categories', 'subcategories'])
            ->withCasts(['avg_rating' => 'float'])
            ->selectRaw('schools.*, COALESCE((SELECT AVG(rating) FROM review_school 
                        JOIN reviews ON reviews.id = review_school.review_id 
                        WHERE review_school.school_id = schools.id), 0) as avg_rating')
            ->firstOrFail();
    
        return new SchoolResource($school);
    }
}