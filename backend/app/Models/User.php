<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    // Поля, которые можно массово назначать
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    // Поля, скрытые при сериализации
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Поля, которые должны быть приведены к определенным типам
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Отношение к таблице `roles`
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}