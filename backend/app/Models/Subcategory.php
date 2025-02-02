<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subcategory extends Model
{
    // Использование фабрики для создания объектов модели
    use HasFactory;

    // Заполняемые поля для массового назначения
    protected $fillable = [
        'category_id',  // Идентификатор категории, к которой принадлежит подкатегория
        'name',          // Название подкатегории
        'url',           // URL подкатегории
        'link',          // Дополнительная ссылка для подкатегории
    ];

    // Определение связи "принадлежит" с категорией
    public function category()
    {
        // Возвращаем категорию, к которой принадлежит данная подкатегория
        return $this->belongsTo(Category::class);
    }

    // Определение связи один ко многим с курсами
    public function courses()
    {
        // Возвращаем все курсы, принадлежащие данной подкатегории
        return $this->hasMany(Course::class);
    }
}
