<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubcategoryResource extends JsonResource
{
    // Метод для преобразования данных ресурса в массив
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,                // Идентификатор подкатегории
            'category_id' => $this->category_id, // Идентификатор категории, к которой принадлежит подкатегория
            'name' => $this->name,            // Название подкатегории
            'url' => $this->url,              // URL подкатегории
            'link' => $this->link,            // Дополнительная ссылка для подкатегории
            'created_at' => $this->created_at, // Дата и время создания записи о подкатегории
            'updated_at' => $this->updated_at, // Дата и время последнего обновления записи о подкатегории
        ];
    }
}
