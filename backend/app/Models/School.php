<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    // Использование фабрики для создания объектов модели
    use HasFactory;

    // Заполняемые поля для массового назначения
    protected $fillable = [
        'name',        // Название школы
        'description', // Описание школы
        'url',         // URL школы
        'link',        // Дополнительная ссылка для школы
        'link_to_school', //Ссылка на оригинальную страницу школы
    ];

    // Определение связи один ко многим с курсами
    public function courses()
    {
        // Возвращаем все курсы, связанные с данной школой
        return $this->hasMany(Course::class);
    }

    // Определение связи многие ко многим с отзывами
    public function reviews()
    {
        // Возвращаем все отзывы, связанные с данной школой через промежуточную таблицу 'review_school'
        return $this->belongsToMany(Review::class, 'review_school', 'school_id', 'review_id');
    }
}
