<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'subcategory_id',
        'school_id',
        'name',
        'description',
        'price',
        'url',
        'link',
        'link-more',
    ];

    // Связь с подкатегорией
    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }

    // Связь со школой
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function reviews()
    {
        return $this->belongsToMany(Review::class, 'review_course', 'course_id', 'review_id');
    }
}