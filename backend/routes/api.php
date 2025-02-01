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

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('categories', CategoryController::class);
Route::apiResource('courses', CourseController::class);
Route::apiResource('reviews', ReviewController::class);
Route::apiResource('subcategories', SubcategoryController::class);
Route::apiResource('schools', SchoolController::class);
Route::apiResource('roles', RoleController::class);
Route::apiResource('users', UserController::class);

// Новый маршрут для получения курса по его URL
Route::get('/courses/url/{url}', [CourseController::class, 'showByUrl']);
Route::get('/schools/url/{url}', [SchoolController::class, 'showByUrl']);