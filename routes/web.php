<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Info;
use App\Models\Artwork;
use App\Models\Post;
use App\Models\User;
use App\Models\Profile;
use App\Http\Controllers\ArtworkController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {

    $info = Info::first();    
    $artworks = Artwork::with(['translations', 'images', 'videos'])->get(); // Traer todos los artworks con sus traducciones e imágenes
    $posts = Post::with(['translations', 'user'])->get();
    $users = User::whereHas('profile')->with(['profile.translates'])->get();

    return Inertia::render('Welcome', [
        'info' => $info,
        'artworks' => $artworks, // Pasar obras de arte a la vista
        'posts' => $posts,
        'users' => $users,
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Agrega rutas adicionales aquí
    Route::get('/configuracion', function() {
        return Inertia::render('Configuracion');
    })->name('configuracion');

    Route::get('/usuarios', function() {
        return Inertia::render('Usuarios');
    })->name('usuarios');

    
    Route::post('/logout', function () {
        Auth::logout();
        return redirect('/');
    })->name('logout');
});



// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

require __DIR__.'/auth.php';
