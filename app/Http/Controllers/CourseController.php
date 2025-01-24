<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Course;
use App\Models\Subcategory;
use App\Models\School;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with(['subcategory', 'school'])->get();
        return Inertia::render('Courses/Index', [
            'courses' => $courses,
        ]);
    }

    public function create()
    {
        $subcategories = Subcategory::all();
        $schools = School::all();
        return Inertia::render('Courses/Create', [
            'subcategories' => $subcategories,
            'schools' => $schools,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'subcategory_id' => 'required|exists:subcategories,id',
            'school_id' => 'required|exists:schools,id',
            'name' => 'required|max:255',
            'description' => 'required',
            'price' => 'required|numeric',
            'link' => 'required|url',
            'link-more' => 'required|url',
        ]);

        Course::create($request->all());

        return redirect()->route('courses.index')
                         ->with('success', 'Course created successfully.');
    }

    public function show(Course $course)
    {
        return Inertia::render('Courses/Show', [
            'course' => $course,
        ]);
    }

    public function edit(Course $course)
    {
        $subcategories = Subcategory::all();
        $schools = School::all();
        return Inertia::render('Courses/Edit', [
            'course' => $course,
            'subcategories' => $subcategories,
            'schools' => $schools,
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $request->validate([
            'subcategory_id' => 'required|exists:subcategories,id',
            'school_id' => 'required|exists:schools,id',
            'name' => 'required|max:255',
            'description' => 'required',
            'price' => 'required|numeric',
            'link' => 'required|url',
            'link-more' => 'required|url',
        ]);

        $course->update($request->all());

        return redirect()->route('courses.index')
                         ->with('success', 'Course updated successfully');
    }

    public function destroy(Course $course)
    {
        $course->delete();

        return redirect()->route('courses.index')
                         ->with('success', 'Course deleted successfully');
    }
}
