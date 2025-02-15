<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use App\Http\Resources\ReviewResource;

class ReviewController extends Controller
{
    // Метод для получения всех отзывов с пагинацией
    public function index(Request $request)
    {
        // Проверяем, передан ли параметр school_id
        $schoolId = $request->query('school_id');

        // Если school_id передан, фильтруем отзывы по школе
        $query = Review::with(['user', 'schools']);
        if ($schoolId) {
            $query->whereHas('schools', function ($q) use ($schoolId) {
                $q->where('schools.id', $schoolId);
            });
        }

        // Получаем отзывы с пагинацией (по 10 на страницу)
        $reviews = $query->paginate(10);

        // Возвращаем коллекцию отзывов с использованием ресурса
        return ReviewResource::collection($reviews);
    }

    // Метод для создания нового отзыва
    public function store(Request $request)
    {
        // Валидация данных запроса
        $validatedData = $request->validate([
            'text' => 'required|string', // Текст отзыва (обязательный)
            'rating' => 'required|integer|min:1|max:5', // Рейтинг от 1 до 5
            'is_approved' => 'sometimes|boolean', // Флаг одобрения отзыва (не обязательный)
            'user_id' => 'required|exists:users,id', // Идентификатор пользователя (обязателен)
            'school_id' => 'required|exists:schools,id', // Идентификатор школы (обязателен)
        ]);

        // Создаем новый отзыв с валидированными данными
        $review = Review::create($validatedData);

        // Добавляем связь с школой в таблицу school_review
        $review->schools()->attach($validatedData['school_id']);

        // Возвращаем созданный отзыв в виде ресурса
        return new ReviewResource($review);
    }

    // Метод для получения отзыва по ID
    public function show($id)
    {
        // Находим отзыв по ID и возвращаем его в виде ресурса
        $review = Review::with('user')->findOrFail($id);
        return new ReviewResource($review);
    }

    // Метод для обновления существующего отзыва
    public function update(Request $request, $id)
    {
        // Находим отзыв по ID
        $review = Review::findOrFail($id);
    
        // Валидация данных запроса
        $validatedData = $request->validate([
            'text' => 'sometimes|required|string', // Текст отзыва (может быть изменен)
            'rating' => 'sometimes|required|integer|min:1|max:5', // Рейтинг (может быть изменен)
            'is_approved' => 'sometimes|boolean', // Флаг одобрения отзыва (может быть изменен)
            'user_id' => 'sometimes|required|exists:users,id', // Идентификатор пользователя (может быть изменен)
            'school_id' => 'sometimes|required|exists:schools,id', // Идентификатор школы (может быть изменен)
        ]);
    
        // Обновляем данные отзыва
        $review->update($validatedData);
    
        // Если school_id передан, обновляем связь с школой
        if (isset($validatedData['school_id'])) {
            $review->schools()->sync([$validatedData['school_id']]);
        }
    
        // Возвращаем обновленный отзыв в виде ресурса
        return new ReviewResource($review);
    }

    // Метод для удаления отзыва
    public function destroy($id)
    {
        // Находим отзыв по ID и удаляем его
        $review = Review::findOrFail($id);
        $review->delete();

        // Возвращаем успешный ответ без контента
        return response()->noContent();
    }
}