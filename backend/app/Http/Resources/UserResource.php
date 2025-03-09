<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    // Метод для преобразования данных ресурса в массив
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,                  // Идентификатор пользователя
            'name' => $this->name,              // Имя пользователя
            'email' => $this->email,            // Электронная почта пользователя
            'email_verified_at' => $this->email_verified_at, // Дата и время подтверждения электронной почты
            'role' => $this->role?->name,        // Название роли пользователя
            'avatar' => $this->avatar,          // Аватар пользователя
            'created_at' => $this->created_at,  // Дата и время создания записи о пользователе
            'updated_at' => $this->updated_at,  // Дата и время последнего обновления записи о пользователе
        ];
    }
}

