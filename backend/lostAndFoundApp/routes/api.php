<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\FoundItemController;

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::post('/user/update', [RegisteredUserController::class, 'update']);
    Route::post('/found-items', [FoundItemController::class, 'store']);
    Route::get('/found-items', [FoundItemController::class, 'index']);
    Route::get('/found-items/{id}', [FoundItemController::class, 'show']);
    Route::delete('/found-items/{id}', [FoundItemController::class, 'deleteClaim']);
    Route::get('/my-lost-items', [FoundItemController::class, 'myLostItems']);
    Route::put('/found-items/{id}', [FoundItemController::class, 'update']);
});
