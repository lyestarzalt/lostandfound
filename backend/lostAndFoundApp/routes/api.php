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
// This route logs out the authenticated user by deleting their current access token.

Route::post('/user/update', [RegisteredUserController::class, 'update']);
// This route updates the authenticated user's information, such as phone number, Telegram ID, and profile picture.

Route::post('/found-items', [FoundItemController::class, 'store']);
// This route allows the authenticated user to post a new found item. The user provides details like title, description, location (latitude and longitude), and an optional picture.

Route::get('/found-items', [FoundItemController::class, 'index']);
// This route retrieves a list of all found items. Each item includes details like title, description, location, and the user who posted it.

Route::get('/found-items/{id}', [FoundItemController::class, 'show']);
// This route retrieves the details of a specific found item identified by its ID. It includes the same details as the index route but for a single item.

Route::delete('/found-items/{id}', [FoundItemController::class, 'deleteClaim']);
// This route allows the authenticated user to delete a specific found item identified by its ID. It ensures that only the user who posted the item can delete it.

Route::get('/my-lost-items', [FoundItemController::class, 'myLostItems']);
// This route retrieves a list of all found items posted by the authenticated user. It filters the items so that only those posted by the current user are included.
Route::put('/found-items/{id}', [FoundItemController::class, 'update']); 
});
