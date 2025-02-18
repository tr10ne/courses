<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SubcategoryController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Получение данных по URL
Route::prefix('courses')->group(function () {
    Route::get('/{categoryUrl}/{subcategoryUrl}/{courseUrl}', [CourseController::class, 'showByUrl'])
        ->name('courses.showByUrl');

    Route::get('/{categoryUrl}/{subcategoryUrl}', [CourseController::class, 'index'])
        ->name('courses.index');
    Route::get('/{categoryUrl}', [CourseController::class, 'index'])
        ->name('courses.index');
});
Route::get('/schools/url/{url}', [SchoolController::class, 'showByUrl'])->name('schools.showByUrl');
Route::get('/categories/url/{url}', [CategoryController::class, 'showByUrl']);
Route::get('/subcategories/url/{url}', [SubcategoryController::class, 'showByUrl']);


Route::apiResource('categories', CategoryController::class);
Route::apiResource('courses', CourseController::class);
Route::apiResource('reviews', ReviewController::class);
Route::apiResource('subcategories', SubcategoryController::class);
Route::apiResource('schools', SchoolController::class);
Route::apiResource('roles', RoleController::class);
Route::apiResource('users', UserController::class);
