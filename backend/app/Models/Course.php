<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    // Использование фабрики для создания объектов модели
    use HasFactory;

    // Заполняемые поля для массового назначения
    protected $fillable = [
        'subcategory_id',  // Идентификатор подкатегории, к которой относится курс
        'school_id',       // Идентификатор школы, которая предоставляет курс
        'name',             // Название курса
        'description',      // Описание курса
        'price',            // Цена курса
        'url',              // URL курса
        'link',             // Дополнительная ссылка для курса
        'link_more',        // Дополнительная информация о курсе
    ];

    // Определение связи "принадлежит" с подкатегорией
    public function subcategory()
    {
        // Возвращаем подкатегорию, к которой относится данный курс
        return $this->belongsTo(Subcategory::class);
    }

    // Определение связи "принадлежит" с школой
    public function school()
    {
        // Возвращаем школу, которая предоставляет данный курс
        return $this->belongsTo(School::class);
    }

    // Определение связи многие ко многим с отзывами
    public function reviews()
    {
        // Возвращаем все отзывы, связанные с курсом через промежуточную таблицу 'review_course'
        return $this->belongsToMany(Review::class, 'review_course', 'course_id', 'review_id');
    }
}
