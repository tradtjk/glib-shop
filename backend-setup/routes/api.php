<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/new', [ProductController::class, 'newArrivals']);
    Route::get('/popular', [ProductController::class, 'popular']);
    Route::get('/{slug}', [ProductController::class, 'show']);
});

Route::post('/orders', [OrderController::class, 'store']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'registerPhone']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
});

Route::middleware('auth:api')->group(function () {
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/favorites/sync', [FavoriteController::class, 'sync']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::get('/auth/me', [AuthController::class, 'me']);
});
