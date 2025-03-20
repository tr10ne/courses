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
use App\Http\Resources\UserResource;

// Если вы хотите защитить маршруты, которые требуют аутентификации, используйте middleware auth:sanctum:
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        // $user = $request->user();
        // $roleName = $user->role?->name; // Получаем название роли

        // return [
        //     'id' => $user->id,
        //     'name' => $user->name,
        //     'email' => $user->email,
        //     'role' => $roleName, // Только название роли
        //     'avatar' => $user->avatar,
        //     'created_at' => $user->created_at,
        //     'updated_at' => $user->updated_at,
        // ];
        return (new UserResource($request->user()))->toArray($request);
    });
    Route::prefix('users')->group(function () {
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });

    Route::prefix('reviews')->group(function () {
        Route::post('/', [ReviewController::class, 'store']);
        Route::get('/{id}', [ReviewController::class, 'show']);
        Route::put('/{id}', [ReviewController::class, 'update']);
        Route::delete('/{id}', [ReviewController::class, 'destroy']);
        Route::patch('/{id}/moderate', [ReviewController::class, 'moderate'])
            ->name('reviews.moderate');
    }); 
});

Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'store']);

// Добавьте маршрут для одобрения/отклонения отзыва

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
Route::get('/reviews', [ReviewController::class, 'index']);

Route::apiResource('categories', CategoryController::class);
Route::apiResource('courses', CourseController::class);
// Route::apiResource('reviews', ReviewController::class);
Route::apiResource('subcategories', SubcategoryController::class);
Route::apiResource('schools', SchoolController::class);
Route::apiResource('roles', RoleController::class);
// Route::apiResource('users', UserController::class);
