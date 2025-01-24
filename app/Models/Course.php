<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'subcategory_id', 'school_id', 'name', 'description', 'price', 'link', 'link-more'
    ];

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function reviews()
    {
        return $this->belongsToMany(Review::class, 'course_review');
    }
}