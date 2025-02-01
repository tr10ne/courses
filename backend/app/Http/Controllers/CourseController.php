<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CourseController extends Controller
{
    // Получить список всех курсов
    // public function index()
    // {
    //     $courses = Course::all();
    //     // $courses = Course::paginate(10); // Пагинация по 10 записей на страницу

    //     return response()->json($courses);
    //     // return Inertia::render('Courses/Index', [
    //     //     'courses' => $courses, // Передаем курсы в компонент
    //     // ]);
    // }

    public function index(Request $request)
    {
        $limit = $request->input('limit', 20);
        $offset = $request->input('offset', 0);
        $filter = $request->input('filter', '');
        $selectedCategoryId = $request->input('selectedCategory', null);

        // Фильтрация
        $query = Course::query();

        if ($filter) {
            $query->where('name', 'like', '%' . $filter . '%');
                }

                // Фильтр по выбранной категории
    if ($selectedCategoryId) {
        // Находим все подкатегории, принадлежащие выбранной категории
        $subcategoryIds = Subcategory::where('category_id', $selectedCategoryId)
            ->pluck('id')
            ->toArray();

        // Фильтруем курсы, которые принадлежат этим подкатегориям
        $query->whereIn('subcategory_id', $subcategoryIds);
    }

        // Получаем общее количество записей
        $total = $query->count();

        // Получаем курсы с пагинацией
        $courses = $query->limit($limit)->offset($offset)->get();

        return response()->json([
            'courses' => $courses,
            'total' => $total,
        ]);
    }

    // // Получить список всех курсов (с пагинацией)
    // public function index(Request $request)
    // {
    //     $perPage = $request->input('per_page', 10); // Количество записей на странице
    //     $courses = Course::paginate($perPage);
    //     return response()->json($courses);
    // }

    // Получить информацию о конкретном курсе по ID
    public function show($id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        return response()->json($course);

        // Если курс не найден, возвращаем 404 ошибку
        // if (!$course) {
        //     abort(404, 'Course not found');
        // }

        // Возвращаем данные курса в компонент Inertia
        // return Inertia::render('Courses/Show', [
        //     'course' => $course, // Передаем курс в компонент
        // ]);
    }

    // Создать новый курс
    public function store(Request $request)
    {
$validatedData =         $request->validate([
            'subcategory_id' => 'required|exists:subcategories,id',
            'school_id' => 'required|exists:schools,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'link' => 'nullable|url',
            //             'link-more' => 'nullable|url',
        ]);

        $course = Course::create($validatedData);
        return response()->json($course, 201);
        // return $course;
    }

    // Обновить информацию о курсе
    public function update(Request $request, $id)
    {
        $course = Course::find($id);
if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $validatedData =         $request->validate([
            'subcategory_id' => 'sometimes|exists:subcategories,id',
            'school_id' => 'sometimes|exists:schools,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'link' => 'nullable|url',
            //             'link-more' => 'nullable|url',
        ]);

        $course->update($validatedData);
        return response()->json($course);
    }

    // Удалить курс
    public function destroy($id)
    {
        $course = Course::find($id);
if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $course->delete();
        return response()->json(['message' => 'Course deleted successfully']);
    }

    // Получить подкатегорию, связанную с курсом
    public function getSubcategory($id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $subcategory = $course->subcategory;
        return response()->json($subcategory);
    }

    // Получить школу, связанную с курсом
    public function getSchool($id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $school = $course->school;
        return response()->json($school);
    }

    // Получить отзывы, связанные с курсом
    public function getReviews($id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $reviews = $course->reviews;
        return response()->json($reviews);
    }
    public function showByUrl($url)
    {
        // Ищем курс по URL
        $course = Course::where('url', $url)->first();

        // Если курс не найден, возвращаем ошибку 404
        if (!$course) {
            return response()->json(['error' => 'Курс не найден'], 404);
        }

        // Возвращаем данные курса
        return response()->json($course);
    }
}
