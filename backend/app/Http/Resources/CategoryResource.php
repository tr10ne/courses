<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    // Метод для преобразования данных ресурса в массив
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,            // Идентификатор категории
            'name' => $this->name,        // Название категории
            'url' => $this->url,          // URL категории
            'created_at' => $this->created_at, // Дата и время создания записи
            'updated_at' => $this->updated_at, // Дата и время последнего обновления записи
           
        ];
    }
}
