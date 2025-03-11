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

    protected $casts = [
        'is_approved' => 'boolean',
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



//роверяет, ожидает ли отзыв модерации
public function isPending()
{
    return $this->is_approved === null;
}

//Проверяет, одобрен ли отзыв
public function isApproved()
{
    return $this->is_approved === true;
}

//Проверяет, отклонен ли отзыв
public function isRejected()
{
    return $this->is_approved === false;
}

//Scope для получения отзывов, ожидающих модерации.
public function scopePending($query)
{
    return $query->whereNull('is_approved');
}

//Scope для получения одобренных отзывов.
public function scopeApproved($query)
{
    return $query->where('is_approved', true);
}

// Scope для получения отклоненных отзывов.
public function scopeRejected($query)
{
    return $query->where('is_approved', false);
}
}

