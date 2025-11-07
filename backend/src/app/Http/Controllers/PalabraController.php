<?php

namespace App\Http\Controllers;

use App\Models\Palabra;
use Illuminate\Http\Request;
// Importamos la Interfaz de Vista que es la que se devuelve
use Illuminate\Contracts\View\View;


class PalabraController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return View 
     */
    public function index(): View // <-- CORREGIDO
    {
        $palabras = Palabra::all(); // <-- Usa Eloquent
        return view('palabras.index', ['palabras' => $palabras]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return View 
     */
    public function indexStyled(): View // <-- CORREGIDO
    {
        $palabras = Palabra::all(); // <-- Usa Eloquent
        return view('palabras.indexStyled', ['palabras' => $palabras]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return View 
     */
    public function indexBlade(): View // <-- CORREGIDO
    {
        $palabras = Palabra::all(); // <-- Usa Eloquent
        return view('palabras.indexBlade', ['palabras' => $palabras]);
    }

    /**
     * Display a listing of the resource, but random.
     *
     * @param int $cantidad
     * @return View
     */
    public function indexRandom($cantidad = 1): View // <-- CORREGIDO y añadido type hint
    {
        $palabras = Palabra::inRandomOrder()->take($cantidad)->get();

        return view('palabras.index', ['palabras' => $palabras]);
    }
}