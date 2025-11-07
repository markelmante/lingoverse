<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PalabraController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/lingo', function () {
    return view('lingo');
})->middleware(['auth', 'verified']);


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//Ruta que devuelve todas las palabras de la tabla 'palabras'
Route::get('/palabras', [PalabraController::class, 'index'])->name('palabras.index');

//Ruta que devuelve todas las palabras de la tabla 'palabras' con estilos css
Route::get('/palabrasStyled', [PalabraController::class, 'indexStyled'])->name('palabras.indexStyled');

//Ruta que devuelve todas las palabras de la tabla 'palabras' con estilos css
Route::get('/palabrasBlade', [PalabraController::class, 'indexBlade'])->name('palabras.indexBlade');

/* Esto crearía automáticamente todas las rutas para el CRUD
Route::resource('palabras', PalabraController::class);
*/

//Ruta que devuelve de la tabla 'palabras' una palabra aleatoria
//Route::get('/palabrasRandom/', [PalabraController::class, indexRandom'])->name('palabras.indexRandomw');

//Ruta que devuelve de la tabla 'palabras' la cantidad de palabras aleatorias solicitada por URL y sino, devuelve 5 palabras
Route::get('/palabrasRandom/{cantidad?}', [PalabraController::class, 'indexRandom'])->name('palabras.indexRandomw');

require __DIR__ . '/auth.php';
