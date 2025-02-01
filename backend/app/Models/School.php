<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'url',
        'link',
    ];

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }

    // Связь с курсом
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function reviews()
    {
        return $this->belongsToMany(Review::class, 'review_school', 'school_id', 'review_id');
    }
}