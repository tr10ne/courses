<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use App\Http\Resources\CourseResource;
use App\Http\Resources\SchoolResource;
use PhpParser\Node\Stmt\Echo_;

class CourseController extends Controller
{
    public function index(Request $request,  $categoryUrl = null, $subcategoryUrl = null)
    {
        // Получаем параметры из запроса
        $limit = $request->input('limit', 10);    // Количество записей на страницу
        $filter = $request->input('filter', '');   // Фильтр по названию курса
        $selectedCategoryId = $request->input('selectedCategoryId', null); // Фильтр по выбранной категории
        $selectedSubcategoryId = $request->input('selectedSubcategoryId', null);
        $maxPrice = $request->input('maxPrice', ''); // Фильтр по максимальной цене
        $minPrice = $request->input('minPrice', ''); // Фильтр по минимальной цене
        $selectedSchoolsId = $request->input('selectedSchoolsId', ''); // Фильтр по выбранным школам
        $schoolUrl = $request->input('schoolurl', ''); // Фильтр по URL школы
        $sortPrice = $request->input('sort_price', null); // Сортировка по цене
        $sortRating = $request->input('sort_rating', null); // Сортировка по рейтингу

        // Создаем запрос для выборки курсов
        $query = Course::with(['school' => function ($query) {
            $query->withCount('reviews as reviews_count')
                ->withCasts(['avg_rating' => 'float'])
                ->selectRaw('schools.*, COALESCE((SELECT AVG(rating) FROM review_school
                                JOIN reviews ON reviews.id = review_school.review_id
                                WHERE review_school.school_id = schools.id), 0) as avg_rating');
        }])
            ->with(['subcategory.category'])
            ->selectRaw('courses.*, COALESCE((SELECT AVG(rating) FROM review_course
            JOIN reviews ON reviews.id = review_course.review_id
            WHERE review_course.course_id = courses.id), 0) as avg_rating')
            ->where(function ($query) use ($filter, $selectedCategoryId, $selectedSubcategoryId, $categoryUrl, $subcategoryUrl, $schoolUrl) {
                if ($selectedSubcategoryId) {
                    $selectedSubcategoryIds = explode(',', $selectedSubcategoryId); // Разделяем строку на массив
                    $query->whereIn('subcategory_id', $selectedSubcategoryIds); // Используем whereIn для фильтрации
                }
                if ($filter) {
                    $query->where('courses.name', 'like', '%' . $filter . '%');
                }
                if (!$selectedSubcategoryId && $selectedCategoryId) {
                    $query->whereHas('subcategory.category', function ($query) use ($selectedCategoryId) {
                        $query->where('id', $selectedCategoryId);
                    });
                }

                if ($categoryUrl) {
                    $query->whereHas('subcategory.category', function ($query) use ($categoryUrl) {
                        $query->where('url', $categoryUrl);
                    });

                    if ($subcategoryUrl) {
                        $query->whereHas('subcategory', function ($query) use ($subcategoryUrl) {
                            $query->where('url', $subcategoryUrl);
                        });
                    }
                }

                if ($schoolUrl) {
                    $query->whereHas('school', function ($query) use ($schoolUrl) {
                        $query->where('url', $schoolUrl);
                    });
                }
            });

            //получаем список всех школ до фильтраций
            $totalSchools = SchoolResource::collection($query->get()->pluck('school')->unique());

            //Сортируем по цене и рейтингу
            if ($sortRating !== null) {
                $query->orderBy('avg_rating', $sortRating === 'true'  ? 'asc' : 'desc');
            }
            if ($sortPrice !== null) {
                $query->orderBy('price', $sortPrice === 'true' ? 'asc' : 'desc');
            }

        // Получаем минимальную и максимальную цену
        $minTotalPrice = $query->min('price');
        $maxTotalPrice = $query->max('price');

        // Фильтр по минимальной(переданной) цене
        if ($minPrice != '') {
            $query->where('courses.price', '>=', $minPrice);
        }

        // Фильтр по максимальной(переданной) цене
        if ($maxPrice != '') {
            $query->where('courses.price', '<=', $maxPrice);
        }

        // Получаем список школ
        $schools = SchoolResource::collection($query->get()->pluck('school')->unique());

        // Дополнительный фильтр по выбранным школам
              $schoolIds = array_filter(explode(',', $selectedSchoolsId));
    if (!empty($schoolIds)) {
        $query->whereIn('school_id', $schoolIds);
    }

        // Обработка случая, когда нет результатов
        if ($query->count() == 0) {
            $maxTotalPrice = 0;
            $minTotalPrice = 0;
        }



        // Логика для управления limit
        if ($limit === 'all') {
            // Возвращаем все курсы без пагинации
            $courses = $query->get();

            return response()->json([
                'min_total_price' => $minTotalPrice,
                'max_total_price' => $maxTotalPrice,
                'schools' => $schools,
                'courses' => CourseResource::collection($courses),
            ]);
        } else {
            // Используем пагинацию
            $courses = $query->paginate($limit);

            return response()->json([
                'min_total_price' => $minTotalPrice,
                'max_total_price' => $maxTotalPrice,
                'schools' => $schools,
                'totalSchools'=>$totalSchools,
                'meta' => [
                    'current_page' => $courses->currentPage(),
                    'from' => $courses->firstItem(),
                    'last_page' => $courses->lastPage(),
                    'per_page' => $courses->perPage(),
                    'to' => $courses->lastItem(),
                    'total' => $courses->total(),
                ],
                'links' => [
                    'first' => $courses->url(1),
                    'last' => $courses->url($courses->lastPage()),
                    'prev' => $courses->previousPageUrl(),
                    'next' => $courses->nextPageUrl(),
                ],
                'courses' => CourseResource::collection($courses),
            ]);
        }
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
            'url' => 'sometimes|required|string|unique:courses,url,' . $id, // URL курса (уникальный)
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
    public function showByUrl($categoryUrl = 0, $subcategoryUrl = 0, $url)
    {
        // Начинаем запрос с жадной загрузкой связанных моделей
        $query = Course::with(['school', 'reviews.user', 'subcategory.category'])
            ->where('url', $url);

        // Если переданы categoryUrl и subcategoryUrl, добавляем дополнительные условия
        if ($categoryUrl && $subcategoryUrl) {
            $query->whereHas('subcategory', function ($query) use ($subcategoryUrl) {
                $query->where('url', $subcategoryUrl);
            })
                ->whereHas('subcategory.category', function ($query) use ($categoryUrl) {
                    $query->where('url', $categoryUrl);
                });
        }

        // Получаем курс или выбрасываем исключение 404
        $course = $query->firstOrFail();

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        // Возвращаем курс в виде ресурса
        return new CourseResource($course);
    }
}
