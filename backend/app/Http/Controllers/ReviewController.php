<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // Получить все отзывы
    public function index()
    {
        return Review::all();
    }

    // Создать новый отзыв
    public function store(Request $request)
    {
        $request->validate([
            'text' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_approved' => 'sometimes|boolean',
            'user_id' => 'required|exists:users,id',
        ]);

        return Review::create($request->all());
    }

    // Получить один отзыв по ID
    public function show($id)
    {
        return Review::findOrFail($id);
    }

    // Обновить отзыв
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        $request->validate([
            'text' => 'sometimes|nullable|string',
            'rating' => 'sometimes|nullable|integer|min:1|max:5',
            'is_approved' => 'sometimes|boolean',
            'user_id' => 'sometimes|required|exists:users,id',
        ]);

        $review->update($request->all());

        return $review;
    }

    // Удалить отзыв
    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->noContent();
    }
}