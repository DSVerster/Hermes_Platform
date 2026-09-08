<?php

namespace App\Http\Controllers;

use App\Models\Courier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourierController extends Controller
{
    /**
     * Display all couriers.
     */
    public function index(Request $request)
    {
        $couriers = Courier::orderBy('name', 'asc')->get();

        if ($request->wantsJson()) {
            return response()->json([
                'couriers' => $couriers,
            ]);
        }

        return Inertia::render('Dashboard', [
            'couriers' => $couriers,
        ]);
    }

    /**
     * Store a new courier.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'contact_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:255',
        ]);

        $courier = Courier::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'contact_person' => $validated['contact_person'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'website' => $validated['website'] ?? null,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Courier created successfully.',
                'courier' => $courier,
            ], 201);
        }

        return redirect()
            ->back()
            ->with('success', 'Courier created successfully.');
    }

    /**
     * Update an existing courier.
     */
    public function update(Request $request, $id)
    {
        $courier = Courier::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'contact_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:255',
        ]);

        $courier->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'contact_person' => $validated['contact_person'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'website' => $validated['website'] ?? null,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Courier updated successfully.',
                'courier' => $courier,
            ]);
        }

        return redirect()
            ->back()
            ->with('success', 'Courier updated successfully.');
    }

    /**
     * Delete a courier.
     */
    public function destroy(Request $request, $id)
    {
        $courier = Courier::findOrFail($id);

        $courier->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Courier deleted successfully.',
            ]);
        }

        return redirect()
            ->back()
            ->with('success', 'Courier deleted successfully.');
    }
}