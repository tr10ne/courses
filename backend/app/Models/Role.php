<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    // Поля, которые можно массово назначать
    protected $fillable = [
        'name',
        'description',
    ];
}