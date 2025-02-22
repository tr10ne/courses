<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    // Использование фабрики для создания объектов модели и уведомлений
    use HasFactory, Notifiable, HasApiTokens;

    // Заполняемые поля для массового назначения
    protected $fillable = [
        'name',       // Имя пользователя
        'email',      // Электронная почта пользователя
        'password',   // Пароль пользователя
        'role_id',    // Идентификатор роли пользователя
    ];

    // Поля, которые должны быть скрыты при сериализации (например, для API)
    protected $hidden = [
        'password',      // Пароль не должен отображаться
        'remember_token', // Токен для запоминания входа (не показывать)
    ];

    // Преобразования для различных типов данных
    protected $casts = [
        'email_verified_at' => 'datetime', // Преобразуем 'email_verified_at' в объект даты
    ];

    // Определение связи "принадлежит" с ролью
    public function role()
    {
        // Возвращаем роль, которая принадлежит данному пользователю
        return $this->belongsTo(Role::class);
    }
}
