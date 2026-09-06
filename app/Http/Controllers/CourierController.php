<?php

namespace App\Http\Controllers;

use App\Models\Courier;
use Illuminate\Http\Request;

class CourierController extends Controller
{
    /**
     * Display a listing of couriers.
     */
    public function index(Request $request)
    {
        $couriers = Courier::orderBy('name', 'asc')->get();

        if ($request->wantsJson()) {
            return response()->json([
                'couriers' => $couriers
            ]);
        }

        // Returns standard inertia payload if accessed from browser dashboard
        return response()->json(['couriers' => $couriers]);
    }
}
