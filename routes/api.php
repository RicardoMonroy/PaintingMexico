<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ArtworkController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\InfoController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/usuarios', [UserController::class, 'index']);
    Route::post('/usuarios', [UserController::class, 'store']);
    
    Route::get('/profiles/{user}', [ProfileController::class, 'show']);
    Route::post('/profiles', [ProfileController::class, 'store']);
    Route::put('/profiles/{profile}', [ProfileController::class, 'update']);

    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{post}', [PostController::class, 'show']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);

    Route::get('/artworks', [ArtworkController::class, 'index']);
    Route::get('/artworks/{artwork}', [ArtworkController::class, 'show']);
    Route::post('/artworks', [ArtworkController::class, 'store']);
    // Route::post('/artworks/{id}', [ArtworkController::class, 'update']);
    Route::put('/artworks/{id}', [ArtworkController::class, 'update']);
    Route::delete('/artworks/{artwork}', [ArtworkController::class, 'destroy']);

    Route::get('/sections', [SectionController::class, 'index']);
    Route::get('/sections/{section}', [SectionController::class, 'show']);
    Route::post('/sections', [SectionController::class, 'store']);
    Route::put('/sections/{id}', [SectionController::class, 'update']);
    Route::delete('/sections/{section}', [SectionController::class, 'destroy']);

    Route::get('/sales', [SaleController::class, 'index']);
    Route::get('/sales/{sale}', [SaleController::class, 'show']);
    Route::post('/sales', [SaleController::class, 'store']);
    Route::put('/sales/{sale}', [SaleController::class, 'update']);
    Route::delete('/sales/{sale}', [SaleController::class, 'destroy']);

    Route::get('/info', [InfoController::class, 'show']);
    Route::put('/info/{id}', [InfoController::class, 'update']);
});
