<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SchoolResource extends JsonResource
{
    // Метод для преобразования данных ресурса в массив
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,                  // Идентификатор школы
            'name' => $this->name,              // Название школы
            'description' => $this->description, // Описание школы
            'url' => $this->url,                // URL школы
            'link' => $this->link,              // Дополнительная ссылка для школы
            'link_to_school' => $this->link_to_school, // Ссылка на оригинальную страницу школы
            'created_at' => $this->created_at,   // Дата и время создания записи о школе
            'updated_at' => $this->updated_at,   // Дата и время последнего обновления записи о школе
        ];
    }
}
