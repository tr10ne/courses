<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray($request)
    {
        // Получаем школу через курс, если отзыв о курсе
        $schoolFromCourse = null;
        if ($this->courses->isNotEmpty()) {
            $course = $this->courses->first();
            $schoolFromCourse = $course->school;
        }

        return [
            'id' => $this->id,
            'text' => $this->text,
            'rating' => $this->rating,
            'is_approved' => $this->is_approved,
            'user_id' => $this->user_id,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),
            'schools' => $this->whenLoaded('schools', function () use ($schoolFromCourse) {
                // Если есть школы, возвращаем их
                if ($this->schools->isNotEmpty()) {
                    return $this->schools->map(function ($school) {
                        return [
                            'id' => $school->id,
                            'name' => $school->name,
                            'url' => $school->url,
                        ];
                    });
                }
                // Если нет школ, но есть школа через курс, возвращаем её
                elseif ($schoolFromCourse) {
                    return [
                        [
                            'id' => $schoolFromCourse->id,
                            'name' => $schoolFromCourse->name,
                            'url' => $schoolFromCourse->url,
                        ]
                    ];
                }
                // Если нет ни школ, ни школы через курс, возвращаем пустой массив
                return [];
            }),
            'courses' => $this->whenLoaded('courses', function () {
                return $this->courses->map(function ($course) {
                    return [
                        'id' => $course->id,
                        'name' => $course->name,
                        'url' => $course->url,
                        'category' => $course,
                    ];
                });
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}