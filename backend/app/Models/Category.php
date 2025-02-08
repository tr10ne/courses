<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    // Использование фабрики для создания объектов модели
    use HasFactory;

    // Заполняемые поля для массового назначения
    protected $fillable = [
        'name',  // Название категории
        'url',   // URL категории
    ];

    // Определение связи один ко многим с подкатегориями
    public function subcategories()
    {
        // Возвращаем все подкатегории, связанные с данной категорией
        return $this->hasMany(Subcategory::class);
    }
}
