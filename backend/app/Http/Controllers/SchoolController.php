<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;
use App\Http\Resources\SchoolResource;

class SchoolController extends Controller
{
    // Получить все школы
    public function index()
    {
        return School::all();
    }

    // Создать новую школу
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:schools',
            'description' => 'required|string',
            'url' => 'nullable|string',
            'link' => 'required|string',
        ]);

        return School::create($request->all());
    }

    // Получить одну школу по ID
    public function show($id)
    {
        $school = School::findOrFail($id);
        return new SchoolResource($school);
    }

    // Обновить школу
    public function update(Request $request, $id)
    {
        $school = School::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|unique:schools,name,' . $school->id,
            'description' => 'sometimes|required|string',
            'url' => 'nullable|string',
            'link' => 'sometimes|required|string',
        ]);

        $school->update($request->all());

        return $school;
    }

    // Удалить школу
    public function destroy($id)
    {
        $school = School::findOrFail($id);
        $school->delete();

        return response()->noContent();
    }

    public function showByUrl($url)
    {
        // Ищем курс по URL
        $course = School::where('url', $url)->first();

        // Если курс не найден, возвращаем ошибку 404
        if (!$course) {
            return response()->json(['error' => 'Курс не найден'], 404);
        }

        // Возвращаем данные курса
        return response()->json($course);
    }
}