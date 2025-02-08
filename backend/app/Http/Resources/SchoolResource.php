<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SchoolResource extends JsonResource
{
    public function toArray(Request $request): array
    {

        // Проверяем имя текущего маршрута
        $routeName = $request->route()->getName();
        
        // Проверяем, является ли текущий маршрут детальной страницей
        $isDetailPage = in_array($routeName, ['schools.show', 'schools.showByUrl'], true);

        // Подсчет количества повторений подкатегорий
        $subcategoriesCount = $this->subcategories
            ->pluck('name') // Берем только названия
            ->countBy() // Считаем количество повторений каждой подкатегории
            ->sortDesc() // Сортируем по убыванию
            ->take(2); // Берем только 2 самые частые

        // Преобразуем ключи (названия подкатегорий) в массив
        $topSubcategories = $subcategoriesCount->keys()->values(); 

        // Основная информация о школе
        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'url' => $this->url,
            'link' => $this->link,
            'link_to_school' => $this->link_to_school,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'rating' => round($this->avg_rating, 2),
            'reviews' => $this->reviews_count,
            'courses' => $this->courses_count,
            'categories' => $this->categories->pluck('name')->unique()->values(),
        ];

        // Если это детальная страница, добавляем все подкатегории
        if ($isDetailPage) {
            $data['subcategories'] = $this->subcategories->pluck('name')->unique()->values();
        } else {
            // Для общей страницы добавляем themes вместо subcategories
            $data['top_subcategories'] = $topSubcategories;
            $data['themes'] = $this->subcategories->pluck('name')->unique()->count();
        }

        return $data;
    }
}


