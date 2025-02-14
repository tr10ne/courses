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

    public function categories()
    {
        return $this->hasManyThrough(
            Category::class,                  // Конечная модель (Category)
            Subcategory::class,               // Промежуточная модель (Subcategory)
            'id',                             // Локальный ключ в subcategories
            'id',                             // Локальный ключ в categories
            'id',                             // Локальный ключ в schools
            'category_id'                     // Внешний ключ на category в subcategories
        ); // Убираем дубликаты категорий
    }

    public function subcategories()
    {
        return $this->hasManyThrough(
            Subcategory::class,               // Конечная модель (Subcategory)
            Course::class,                    // Промежуточная модель (Course)
            'school_id',                      // Внешний ключ на school в courses
            'id',                             // Локальный ключ в subcategories
            'id',                             // Локальный ключ в schools
            'subcategory_id'                  // Внешний ключ на subcategory в courses
        ); // Убираем дубликаты подкатегорий
    }

    // Метод для получения среднего рейтинга школы
    public function getAverageRating(): float
    {
        if ($this->reviews()->count() === 0) {
            return 0; // Если нет отзывов, возвращаем 0
        }

        return $this->reviews()->avg('rating') ?? 0; // Рассчитываем среднее значение рейтинга
    }

    // Метод для получения количества отзывов о школе
    public function getReviewsCount(): int
    {
        return $this->reviews()->count();
    }
}
