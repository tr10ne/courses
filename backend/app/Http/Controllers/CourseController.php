<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use App\Http\Resources\CourseResource;

class CourseController extends Controller
{
    // Метод для получения списка курсов с фильтрацией и пагинацией
    public function index(Request $request)
    {
        // Получаем параметры из запроса
        $limit = $request->input('limit', 10);    // Количество записей на страницу
        $offset = $request->input('offset', 0);    // Смещение для пагинации
        $filter = $request->input('filter', '');   // Фильтр по названию курса
        $selectedCategoryId = $request->input('selectedCategory', null); // Фильтр по выбранной категории
        $maxPrice = $request->input('maxPrice', ''); // Фильтр по максимальной цене
        $minPrice = $request->input('minPrice', ''); // Фильтр по минимальной цене
        $selectedSchools = $request->input('selectedSchools', ''); // Фильтр по выбранным школам

        // Создаем запрос для выборки курсов
        $query = Course::with('school', 'school.reviews'); // Предварительная загрузка школы и её отзывов

        // Применяем фильтр по названию курса
        if ($filter) {
            $query->where('name', 'like', '%' . $filter . '%');
        }

        // Фильтр по выбранной категории
        if ($selectedCategoryId) {
            // Находим все подкатегории для выбранной категории
            $subcategoryIds = Subcategory::where('category_id', $selectedCategoryId)
                ->pluck('id')
                ->toArray();

            // Фильтруем курсы по подкатегориям
            $query->whereIn('subcategory_id', $subcategoryIds);
        }


          // Находим максимальную цену среди курсов
          $totalMinPrice = $query->min('price');
          $totalMaxPrice = $query->max('price');


        // Фильтр по минимальной цене
        if ($minPrice != '') {
            $query->where('price', '>=', $minPrice);
        }
        else{
            $minPrice = $totalMinPrice;
        }

        // Фильтр по максимальной цене
        if ($maxPrice != '') {
            $query->where('price', '<=', $maxPrice);
        }
        else{
            $maxPrice =  $totalMaxPrice;
        }

        // Создаем копию запроса для получения школ без фильтрации по цене
    $queryWithoutPriceFilter = clone $query;

// Фильтр по выбранным школам
if ($selectedSchools) {
    $schoolIds = explode(',', $selectedSchools); // Преобразуем строку в массив ID школ
    $query->whereHas('school', function ($q) use ($schoolIds) {
        $q->whereIn('id', $schoolIds); // Фильтруем курсы по ID школ
    });
}

 // Получаем общее количество курсов
 $total = $query->count();

 if($total==0){
$maxPrice = 0;
$minPrice = 0;
$totalMaxPrice = 0;
$totalMinPrice = 0;
 }




 $schoolsWithoutPriceFilter = $queryWithoutPriceFilter
        // ->whereIn('price', [$minPrice, $maxPrice])
        ->with('school')
        ->get()
        ->pluck('school')
        ->unique()
        ->values();

        // Получаем курсы с пагинацией
        $courses = $query->limit($limit)->offset($offset)->get();

        // Формируем ответ с дополнительной информацией о школе и количестве отзывов
        $coursesWithSchoolAndReviewCount = $courses->map(function ($course) {
            $school = $course->school;
            $reviewCount = $school ? $school->reviews()->count() : 0;

            // Получаем все отзывы для курса
            $ratings = $course->reviews()->pluck('rating');

            // Рассчитываем средний рейтинг курса
            $averageRating = $ratings->isNotEmpty() ? round($ratings->avg(), 1) : null;

            return [
                'course' => $course,
                'course_rating' => $averageRating,
                'school' => $school,
                'review_count' => $reviewCount,
            ];
        });



        // Возвращаем курсы и общее количество
        return response()->json([
            'courses' => $coursesWithSchoolAndReviewCount,
            'total' => $total,
            'max_price' => $maxPrice, // Максимальная цена среди курсов
            'min_price' => $minPrice,
            'max_total_price' => $totalMaxPrice, // Максимальная цена среди курсов
            'min_total_price' => $totalMinPrice,
            'schools' => $schoolsWithoutPriceFilter, // Школы без фильтрации по цене
        ]);
    }

    // Метод для получения курса по его ID
    public function show($id)
    {
        $course = Course::find($id);

        // Если курс не найден, возвращаем ошибку
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        // Возвращаем данные курса
        return response()->json($course);
    }

    // Метод для создания нового курса
    public function store(Request $request)
    {
        // Валидация данных запроса
        $validatedData = $request->validate([
            'subcategory_id' => 'required|exists:subcategories,id', // Подкатегория должна существовать
            'school_id' => 'required|exists:schools,id', // Школа должна существовать
            'name' => 'required|string|max:255', // Название курса обязательно
            'description' => 'nullable|string', // Описание курса
            'price' => 'required|numeric|min:0', // Цена курса
            'url' => 'required|string|unique:courses,url', // URL курса (уникальный)
            'link' => 'nullable|string', // Ссылка на курс (не обязательна)
            'link_more' => 'nullable|string', // Дополнительная ссылка на курс (не обязательна)
        ]);

        // Создаем новый курс с валидационными данными
        $course = Course::create($validatedData);
        // Возвращаем созданный курс в виде ресурса
        return new CourseResource($course);
    }

    // Метод для обновления информации о курсе
    public function update(Request $request, $id)
    {
        // Находим курс по ID, если не найдено - будет ошибка 404
        $course = Course::findOrFail($id);

        // Валидация данных запроса
        $validatedData = $request->validate([
            'subcategory_id' => 'sometimes|exists:subcategories,id', // Подкатегория может быть изменена
            'school_id' => 'sometimes|exists:schools,id', // Школа может быть изменена
            'name' => 'sometimes|string|max:255', // Название может быть изменено
            'description' => 'sometimes|nullable|string', // Описание может быть изменено
            'price' => 'sometimes|numeric|min:0', // Цена может быть изменена
            'url' => 'sometimes|required|string|unique:courses,url' . $course->$id, // URL курса (уникальный)
            'link' => 'sometimes|nullable|string', // Ссылка на курс (не обязательна)
            'link_more' => 'sometimes|nullable|string', // Дополнительная ссылка на курс (не обязательна)
        ]);

        // Обновляем данные курса
        $course->update($validatedData);
        // Возвращаем обновленный курс в виде ресурса
        return new CourseResource($course);
    }

    // Метод для удаления курса
    public function destroy($id)
    {
        // Находим курс по ID, если не найдено - будет ошибка 404
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        // Удаляем курс
        $course->delete();
        // Возвращаем сообщение об успешном удалении
        return response()->json(['message' => 'Course deleted successfully']);
    }

    // Метод для получения подкатегории, связанной с курсом
    public function getSubcategory($id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        // Получаем подкатегорию курса и возвращаем её
        $subcategory = $course->subcategory;
        return response()->json($subcategory);
    }

    // Метод для получения школы, связанной с курсом
    public function getSchool($id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        // Получаем школу курса и возвращаем её
        $school = $course->school;
        return response()->json($school);
    }

    // Метод для получения отзывов, связанных с курсом
    public function getReviews($id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        // Получаем отзывы курса и возвращаем их
        $reviews = $course->reviews;
        return response()->json($reviews);
    }
    // Метод для получения курса по URL
    public function showByUrl($url)
    {
        // Находим курс по URL, если не найдено - будет ошибка 404
        $course = Course::where('url', $url)->firstOrFail();
        // Возвращаем курс в виде ресурса
        return new CourseResource($course);
    }
}
