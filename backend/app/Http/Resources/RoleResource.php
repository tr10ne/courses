<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    // Метод для преобразования данных ресурса в массив
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,                // Идентификатор роли
            'name' => $this->name,            // Название роли (например, "Администратор", "Пользователь")
            'created_at' => $this->created_at, // Дата и время создания роли
            'updated_at' => $this->updated_at, // Дата и время последнего обновления роли
        ];
    }
}
