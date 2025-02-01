<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'text',
        'rating',
        'is_approved',
        'user_id',
    ];

    // Связь с пользователем
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Связь с курсами (многие-ко-многим через промежуточную таблицу)
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'review_course', 'review_id', 'course_id');
    }

    // Отношение "многие ко многим" с таблицей `schools`
    public function schools()
    {
        return $this->belongsToMany(School::class, 'review_school');
    }
}