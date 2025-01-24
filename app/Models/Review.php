<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = ['text_review', 'rating', 'id_user', 'approved'];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_review');
    }

    public function schools()
    {
        return $this->belongsToMany(School::class, 'school_review');
    }
}