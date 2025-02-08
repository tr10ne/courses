<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    // Использование фабрики для создания объектов модели
    use HasFactory;

    // Заполняемые поля для массового назначения
    protected $fillable = [
        'text',        // Текст отзыва
        'rating',      // Оценка отзыва (например, от 1 до 5)
        'is_approved', // Статус одобрения отзыва (например, "одобрен" или "неодобрен")
        'user_id',     // Идентификатор пользователя, оставившего отзыв
    ];

    // Определение связи "принадлежит" с пользователем
    public function user()
    {
        // Возвращаем пользователя, который написал данный отзыв
        return $this->belongsTo(User::class);
    }

    // Определение связи многие ко многим с курсами
    public function courses()
    {
        // Возвращаем все курсы, к которым относится данный отзыв через промежуточную таблицу 'review_course'
        return $this->belongsToMany(Course::class, 'review_course', 'review_id', 'course_id');
    }

    // Определение связи многие ко многим с школами
    public function schools()
    {
        // Возвращаем все школы, к которым относится данный отзыв через промежуточную таблицу 'review_school'
        return $this->belongsToMany(School::class, 'review_school', 'review_id', 'school_id');
    }
}
