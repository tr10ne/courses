<?php

namespace App\Http\Resources;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    // Метод для преобразования данных ресурса в массив
    public function toArray(Request $request, $pageIsLoaded = false): array
    {
        // Проверяем имя текущего маршрута
        $routeName = $request->route()->getName();

        // Проверяем, является ли текущий маршрут детальной страницей
        $isDetailPage = in_array($routeName, ['courses.show', 'courses.showByUrl'], true);


        $data =  [
            'id' => $this->id,                  // Идентификатор курса
            'subcategory_id' => $this->subcategory_id, // Идентификатор подкатегории, к которой относится курс
            'subcategory_name' => $this->subcategory->name, // Идентификатор подкатегории, к которой относится курс
            'school_id' => $this->school_id,     // Идентификатор школы, которая предоставляет курс
            'name' => $this->name,               // Название курса
            'description' => $this->description, // Описание курса
            'price' => $this->price,             // Цена курса
            'url' => $this->url,                 // URL курса
            'link' => $this->link,               // Дополнительная ссылка для курса
            'link_more' => $this->link_more,     // Дополнительная информация о курсе
            'created_at' => $this->created_at,   // Дата и время создания курса
            'updated_at' => $this->updated_at,   // Дата и время последнего обновления курса
            'category' => [
                'id' => $this->subcategory->category->id,
                'name' => $this->subcategory->category->name,
                'url' => $this->subcategory->category->url,
            ],
            'subcategory' => [
                'id' => $this->subcategory->id,
                'name' => $this->subcategory->name,
                'url' => $this->subcategory->url,
            ],
            'reviews_count' => $this->getReviewsCount(),
            'average_rating' => round($this->getAverageRating(), 2),
            'school' => [
                'id' => $this->school->id,
                'name' => $this->school->name,
            ]

        ];

        if ($isDetailPage && !$pageIsLoaded) {
            $data['reviews'] = $this->reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'text' => $review->text,
                    'rating' => $review->rating,
                    'is_approved' => $review->is_approved,
                    'user' => [
                        'id' => $review->user->id,
                        'name' => $review->user->name,
                        'email' => $review->user->email,
                    ],
                    'created_at' => $review->created_at,
                    'updated_at' => $review->updated_at,
                ];
            });

            // Получаем 3 курса из той же подкатегории (исключая текущий курс)
            $relatedCourses = Course::where('subcategory_id', $this->subcategory_id)
                ->where('id', '!=', $this->id)
                ->limit(3)
                ->get();

            // Добавляем связанные курсы в массив данных
            $data['related_courses'] = $relatedCourses->map(function ($course) {
                return [
                    'id' => $course->id,
                    'name' => $course->name,
                    'url' => $course->url,
                    'price' => $course->price,
                    'school' => $course->school,
                    'average_rating' => round($course->getAverageRating(), 2),
                    'reviews_count' => $course->getReviewsCount(),
                    'category' => [
                        'id' => $course->subcategory->category->id,
                        'name' => $course->subcategory->category->name,
                        'url' => $course->subcategory->category->url,
                    ],
                    'subcategory' => [
                        'id' => $course->subcategory->id,
                        'name' => $course->subcategory->name,
                        'url' => $course->subcategory->url,
                    ],
                ];
            });

            $data['school'] = [
                'id' => $this->school->id,
                'name' => $this->school->name,
                'description' => $this->school->description,
                'url' => $this->school->url,
                'link' => $this->school->link,
                'link_to_school' => $this->school->link_to_school,
                'rating' => round($this->school->getAverageRating(), 2), // Средний рейтинг школы
                'reviews' => $this->school->getReviewsCount(),   // Количество отзывов о школе
            ];
        }

        return $data;
    }
}
