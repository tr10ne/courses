<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use App\Http\Resources\ReviewResource;

class ReviewController extends Controller
{
    // Метод для получения всех отзывов
    public function index()
    {
        // Возвращаем коллекцию всех отзывов с использованием ресурса
        return ReviewResource::collection(Review::all());
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
        ]);

        // Создаем новый отзыв с валидированными данными
        $review = Review::create($validatedData);
        // Возвращаем созданный отзыв в виде ресурса
        return new ReviewResource($review);
    }

    // Метод для получения отзыва по ID
    public function show($id)
    {
        // Находим отзыв по ID и возвращаем его в виде ресурса
        return new ReviewResource(Review::findOrFail($id));
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
        ]);

        // Обновляем данные отзыва
        $review->update($validatedData);
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
