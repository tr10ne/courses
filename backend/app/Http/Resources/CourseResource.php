<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    // Метод для преобразования данных ресурса в массив
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,                  // Идентификатор курса
            'subcategory_id' => $this->subcategory_id, // Идентификатор подкатегории, к которой относится курс
            'school_id' => $this->school_id,     // Идентификатор школы, которая предоставляет курс
            'name' => $this->name,               // Название курса
            'description' => $this->description, // Описание курса
            'price' => $this->price,             // Цена курса
            'url' => $this->url,                 // URL курса
            'link' => $this->link,               // Дополнительная ссылка для курса
            'link_more' => $this->link_more,     // Дополнительная информация о курсе
            'created_at' => $this->created_at,   // Дата и время создания курса
            'updated_at' => $this->updated_at,   // Дата и время последнего обновления курса
        ];
    }
}
