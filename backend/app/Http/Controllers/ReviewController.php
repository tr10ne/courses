<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use App\Http\Resources\ReviewResource;
use App\Models\Course;

class ReviewController extends Controller
{
    // Метод для получения всех отзывов с пагинацией или без
    public function index(Request $request)
    {
        // Получаем параметры из запроса
        $schoolId = $request->query('school_id');
        $courseId = $request->query('course_id');
        $status = $request->query('status', 'approved'); // По умолчанию "одобренные"
        $userId = $request->query('user_id');

        // Начинаем запрос с жадной загрузкой связей
        $query = Review::with(['user', 'schools', 'courses']);

        // Фильтрация по школе
        if ($schoolId) {
            $query->whereHas('schools', function ($q) use ($schoolId) {
                $q->where('schools.id', $schoolId);
            });
        }

        // Фильтрация по статусу отзыва
        if ($status === 'pending') {
            $query->pending();
        } elseif ($status === 'approved') {
            $query->approved();
        } elseif ($status === 'rejected') {
            $query->rejected();
        }

        // Фильтрация по пользователю
        if ($userId) {
            $query->where('user_id', $userId);
        }

        // Фильтрация по курсу
        if ($courseId) {
            $query->whereHas('courses', function ($q) use ($courseId) {
                $q->where('courses.id', $courseId);
            });
        }

        // Параметры пагинации и сортировки
        $limit = $request->query('limit', 10); // Количество записей на страницу
        $sortBy = $request->query('sort_by', 'date'); // Поле для сортировки
        $sortOrder = $request->query('sort_order', 'desc'); // Порядок сортировки

        // Применяем сортировку
        if ($sortBy === 'date') {
            $query->orderBy('created_at', $sortOrder);
        } elseif ($sortBy === 'rating') {
            $query->orderBy('rating', $sortOrder);
        }

        // Возвращаем результаты
        if ($limit === 'all') {
            $reviews = $query->get();
            return ReviewResource::collection($reviews);
        }

        $reviews = $query->paginate($limit);
        return ReviewResource::collection($reviews);
    }

    // public function index(Request $request)
    // {
    //     // Проверяем, передан ли параметр school_id
    //     $schoolId = $request->query('school_id');
    //     $courseId = $request->query('course_id');
    //     $status = $request->query('status', 'approved');
    //     $userId = $request->query('user_id');

    //     // Если school_id передан, фильтруем отзывы по школе
    //     $query = Review::with(['user', 'schools', 'courses']);
    //     if ($schoolId) {
    //         $query->whereHas('schools', function ($q) use ($schoolId) {
    //             $q->where('schools.id', $schoolId);
    //         });
    //     }

    //     if ($status === 'pending') {
    //         $query->pending();
    //     } elseif ($status === 'approved') {
    //         $query->approved();
    //     } elseif ($status === 'rejected') {
    //         $query->rejected();
    //     }

    //     if ($userId) {
    //         $query->where('user_id', $userId);
    //     }

    //     if ($courseId) {
    //         // Находим школу через курс
    //         $course = Course::findOrFail($courseId);

    //         // Проверяем, существует ли школа для данного курса
    //         if (!$course->school_id) {
    //             return response()->json(['error' => 'The specified course does not belong to any school.'], 400);
    //         }

    //         // Фильтрация по школе, связанной с курсом
    //         $query->whereHas('schools', function ($q) use ($course) {
    //             $q->where('schools.id', $course->school_id);
    //         });

    //         // Также фильтруем по курсу (если это необходимо)
    //         $query->whereHas('courses', function ($q) use ($courseId) {
    //             $q->where('courses.id', $courseId);
    //         });

    //                 }

    //     // Добавляем фильтрацию по пользователю и школе
    //     if ($request->has('user_id') && $request->has('school_id')) {
    //         $query->where('user_id', $request->user_id)
    //             ->whereHas('schools', function($q) use ($request) {
    //                 $q->where('schools.id', $request->school_id);
    //             });
    //     }

    //     // Добавляем фильтрацию по курсам и пользователю
    //     if ($request->has('user_id') && $request->has('course_id')) {
    //         $query->where('user_id', $request->user_id)
    //             ->whereHas('courses', function($q) use ($request) {
    //                 $q->where('courses.id', $request->course_id);
    //             });
    //     }

    //     // Проверяем, передан ли параметр limit
    //     $limit = $request->query('limit', 10); // По умолчанию 10 на страницу

    //     // Параметры сортировки
    //     $sortBy = $request->query('sort_by', 'date'); // По умолчанию сортируем по дате
    //     $sortOrder = $request->query('sort_order', 'desc'); // По умолчанию по убыванию

    //     // Применяем сортировку
    //     if ($sortBy === 'date') {
    //         $query->orderBy('created_at', $sortOrder);
    //     } elseif ($sortBy === 'rating') {
    //         $query->orderBy('rating', $sortOrder);
    //     }

    //     // Если limit равен 'all', возвращаем все отзывы без пагинации
    //     if ($limit === 'all') {
    //         $reviews = $query->get();
    //         return ReviewResource::collection($reviews);
    //     }

    //     // Иначе возвращаем отзывы с пагинацией, используя limit
    //     $reviews = $query->paginate($limit);
    //     return ReviewResource::collection($reviews);
    // }

    // Метод для создания нового отзыва
    public function store(Request $request)
    {
        // Валидация данных запроса
        $validatedData = $request->validate([
            'text' => 'required|string', // Текст отзыва (обязательный)
            'rating' => 'required|integer|min:1|max:5', // Рейтинг от 1 до 5
            'is_approved' => 'sometimes|nullable|boolean', // Флаг одобрения отзыва (не обязательный)
            'user_id' => 'required|exists:users,id', // Идентификатор пользователя (обязателен)
            'school_id' => 'nullable|exists:schools,id', // Идентификатор школы
            'course_id' => 'nullable|exists:courses,id', // Добавляем курс
        ]);

        // Создаем новый отзыв с валидированными данными
        $review = Review::create($validatedData);

        // // Добавляем связь с школой в таблицу school_review
        // $review->schools()->attach($validatedData['school_id']);

        // Добавляем связь с школой (если school_id передан)
        if (isset($validatedData['school_id'])) {
            $review->schools()->attach($validatedData['school_id']);
        }
        // Добавляем связь с курсом (если course_id передан)
        else if (isset($validatedData['course_id'])) {
            $review->courses()->attach($validatedData['course_id']);
        }

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
            'is_approved' => 'sometimes|nullable|boolean', // Флаг одобрения отзыва (может быть изменен)
            'user_id' => 'sometimes|required|exists:users,id', // Идентификатор пользователя (может быть изменен)
            'school_id' => 'sometimes|required|exists:schools,id', // Идентификатор школы (может быть изменен)

            'course_id' => 'sometimes|exists:courses,id', // Добавляем курс
        ]);

        // Обновляем данные отзыва
        $review->update($validatedData);

        // // Если school_id передан, обновляем связь с школой
        // if (isset($validatedData['school_id'])) {
        //     $review->schools()->sync([$validatedData['school_id']]);
        // }

        if (isset($validatedData['school_id'])) {
            $review->schools()->sync([$validatedData['school_id']]);
        }

        else if (isset($validatedData['course_id'])) {
            $review->courses()->sync([$validatedData['course_id']]);
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

    // Метод для модерации отзыва (одобрение/отклонение).

    public function moderate(Request $request, $id)
    {
        // Находим отзыв по ID
        $review = Review::findOrFail($id);

        // Проверяем, что текущий пользователь является автором отзыва или администратором
        if (!auth()->user()->isModerator()) {
            return response()->json(['error' => 'У вас нет прав на редактирование этого отзыва'], 403);
        }

        // Валидация данных запроса
        $validatedData = $request->validate([
            'action' => 'required|in:approve,reject', // Действие: approve или reject
        ]);

        // Определяем новый статус в зависимости от действия
        $newStatus = ($validatedData['action'] === 'approve') ? true : false;

        // Обновляем статус is_approved
        $review->update(['is_approved' => $newStatus]);

        // Возвращаем обновленный отзыв в виде ресурса
        return new ReviewResource($review);
    }
}