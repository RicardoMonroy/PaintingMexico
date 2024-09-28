<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Models\Info;
use App\Models\Artwork;
use App\Models\Section;
use App\Models\Post;
use App\Models\User;
use App\Models\Profile;
use App\Models\Sale;
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
    $artworks = Artwork::with(['translations', 'images', 'videos', 'sections.translations'])
                        ->orderBy('created_at', 'desc')
                        ->take(30)
                        ->get();
    
    $sections = Section::with(['translations'])
                        ->orderBy('created_at', 'desc')
                        ->take(15)
                        ->get();

    $posts = Post::with(['translations', 'user'])
                        ->orderBy('created_at', 'desc') 
                        ->take(9) 
                        ->get();

    $sales = Sale::with(['saleURLs', 'saleTranslates', 'saleGalleries'])
                        ->orderBy('created_at', 'desc')
                        ->get();

    $users = User::whereHas('profile')->with(['profile.translates'])->get();

    return Inertia::render('Welcome', [
        'info' => $info,
        'artworks' => $artworks, // Pasar obras de arte a la vista
        'sections' => $sections, // Pasar secciones a la vista
        'posts' => $posts,
        'sales' => $sales,
        'users' => $users,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/configuracion', function() {
        return Inertia::render('Configuracion');
    })->name('configuracion');

    Route::get('/usuarios', function() {
        return Inertia::render('Usuarios');
    })->name('usuarios');

    // Route::get('/posts', function() {
    //     return Inertia::render('Posts');
    // })->name('posts');

    Route::get('/artworks', function() {
        return Inertia::render('Artworks');
    })->name('artworks');

    Route::get('/sections', function() {
        return Inertia::render('Sections');
    })->name('sections');

    Route::get('/sales', function() {
        return Inertia::render('Sales');
    })->name('sales');

    Route::get('/info', function() {
        return Inertia::render('Info');
    })->name('info');

    
    Route::post('/logout', function () {
        Auth::logout();
        return redirect('/');
    })->name('logout');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
