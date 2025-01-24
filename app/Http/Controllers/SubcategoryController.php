<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Subcategory;
use Illuminate\Http\Request;

class SubcategoryController extends Controller
{
    public function index()
    {
        $subcategories = Subcategory::with('category')->get();
        return Inertia::render('Subcategories/Index', [
            'subcategories' => $subcategories,
        ]);
    }

    public function create()
    {
        $categories = \App\Models\Category::all();
        return Inertia::render('Subcategories/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|max:255',
            'link' => 'required|url',
        ]);

        Subcategory::create($request->all());

        return redirect()->route('subcategories.index')
                         ->with('success', 'Subcategory created successfully.');
    }

    public function show(Subcategory $subcategory)
    {
        return Inertia::render('Subcategories/Show', [
            'subcategory' => $subcategory,
        ]);
    }

    public function edit(Subcategory $subcategory)
    {
        $categories = \App\Models\Category::all();
        return Inertia::render('Subcategories/Edit', [
            'subcategory' => $subcategory,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Subcategory $subcategory)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|max:255',
            'link' => 'required|url',
        ]);

        $subcategory->update($request->all());

        return redirect()->route('subcategories.index')
                         ->with('success', 'Subcategory updated successfully');
    }

    public function destroy(Subcategory $subcategory)
    {
        $subcategory->delete();

        return redirect()->route('subcategories.index')
                         ->with('success', 'Subcategory deleted successfully');
    }
}