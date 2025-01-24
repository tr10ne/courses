<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with('user')->get();
        return Inertia::render('Reviews/Index', [
            'reviews' => $reviews,
        ]);
    }

    public function create()
    {
        $users = User::all();
        return Inertia::render('Reviews/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'text_review' => 'required',
            'rating' => 'required|integer|min:1|max:5',
            'id_user' => 'required|exists:users,id',
            'approved' => 'boolean',
        ]);

        Review::create($request->all());

        return redirect()->route('reviews.index')
                         ->with('success', 'Review created successfully.');
    }

    public function show(Review $review)
    {
        return Inertia::render('Reviews/Show', [
            'review' => $review,
        ]);
    }

    public function edit(Review $review)
    {
        $users = User::all();
        return Inertia::render('Reviews/Edit', [
            'review' => $review,
            'users' => $users,
        ]);
    }

    public function update(Request $request, Review $review)
    {
        $request->validate([
            'text_review' => 'required',
            'rating' => 'required|integer|min:1|max:5',
            'id_user' => 'required|exists:users,id',
            'approved' => 'boolean',
        ]);

        $review->update($request->all());

        return redirect()->route('reviews.index')
                         ->with('success', 'Review updated successfully');
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return redirect()->route('reviews.index')
                         ->with('success', 'Review deleted successfully');
    }
}