<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ranking;
use Illuminate\Support\Facades\Auth;

class RankingController extends Controller
{
    // Guardar ranking
    public function store(Request $request)
    {
        $request->validate([
            'score' => 'required|integer',
            'intentos' => 'required|integer',
            'tiempo' => 'required|integer',
        ]);

        $ranking = Ranking::create([
            'user_id' => Auth::id(),
            'score' => $request->score,
            'intentos' => $request->intentos,
            'tiempo' => $request->tiempo,
        ]);

        return response()->json(['success' => true, 'ranking' => $ranking]);
    }

    // Obtener ranking top 10
    public function index()
    {
        $rankings = Ranking::with('user')
            ->orderBy('score', 'desc')
            ->orderBy('tiempo', 'asc')
            ->take(10)
            ->get();

        return response()->json($rankings);
    }
}
