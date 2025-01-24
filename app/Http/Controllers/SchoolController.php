<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\School;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    public function index()
    {
        $schools = School::all();
        return Inertia::render('Schools/Index', [
            'schools' => $schools,
        ]);
    }

    public function create()
    {
        return Inertia::render('Schools/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|max:255',
            'description' => 'required',
            'link' => 'required|url',
        ]);

        School::create($request->all());

        return redirect()->route('schools.index')
                         ->with('success', 'School created successfully.');
    }

    public function show(School $school)
    {
        return Inertia::render('Schools/Show', [
            'school' => $school,
        ]);
    }

    public function edit(School $school)
    {
        return Inertia::render('Schools/Edit', [
            'school' => $school,
        ]);
    }

    public function update(Request $request, School $school)
    {
        $request->validate([
            'name' => 'required|max:255',
            'description' => 'required',
            'link' => 'required|url',
        ]);

        $school->update($request->all());

        return redirect()->route('schools.index')
                         ->with('success', 'School updated successfully');
    }

    public function destroy(School $school)
    {
        $school->delete();

        return redirect()->route('schools.index')
                         ->with('success', 'School deleted successfully');
    }
}
