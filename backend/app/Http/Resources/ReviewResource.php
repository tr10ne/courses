<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    // Метод для преобразования данных ресурса в массив
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,                // Идентификатор отзыва
            'text' => $this->text,            // Текст отзыва
            'rating' => $this->rating,        // Оценка отзыва
            'is_approved' => $this->is_approved, // Статус одобрения отзыва
            'user_id' => $this->user_id,      // Идентификатор пользователя, оставившего отзыв
            'created_at' => $this->created_at, // Дата и время создания отзыва
            'updated_at' => $this->updated_at, // Дата и время последнего обновления отзыва
        ];
    }
}
