<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StaffController extends Controller
{
    /**
     * Display a listing of staff.
     */
    public function index(Request $request)
    {
        $staff = Staff::orderBy('name', 'asc')->get();

        if ($request->wantsJson()) {
            return response()->json([
                'staff' => $staff
            ]);
        }

        return Inertia::render('Staff/Index', [
            'staff' => $staff
        ]);
    }

    /**
     * Store a newly created staff member.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'role' => 'required|string|max:100',
            'email_account' => 'required|email|max:255|unique:staff,email_account',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // REMOVED manual Hash::make because Staff model automatically hashes password_hash field via casts
        $staff = Staff::create([
            'name' => $validated['name'],
            'surname' => $validated['surname'],
            'role' => $validated['role'],
            'email_account' => $validated['email_account'],
            'password_hash' => $validated['password'],
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Staff member created successfully.',
                'staff' => $staff
            ], 201);
        }

        return redirect()->back()->with('success', 'Staff member created successfully.');
    }

    /**
     * Display a specific staff member.
     */
    public function show(Request $request, $id)
    {
        $staff = Staff::findOrFail($id);

        if ($request->wantsJson()) {
            return response()->json([
                'staff' => $staff
            ]);
        }

        return Inertia::render('Staff/Show', [
            'staff' => $staff
        ]);
    }

    /**
     * Update an existing staff member.
     */
    public function update(Request $request, $id)
    {
        $staff = Staff::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'surname' => 'sometimes|required|string|max:255',
            'role' => 'sometimes|required|string|max:100',
            'email_account' => 'sometimes|required|email|max:255|unique:staff,email_account,' . $id . ',staff_id',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $staff->name = $validated['name'] ?? $staff->name;
        $staff->surname = $validated['surname'] ?? $staff->surname;
        $staff->role = $validated['role'] ?? $staff->role;
        $staff->email_account = $validated['email_account'] ?? $staff->email_account;

        if (!empty($validated['password'])) {
            // REMOVED manual Hash::make here as well to prevent double-hashing
            $staff->password_hash = $validated['password'];
        }

        $staff->save();

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Staff member updated successfully.',
                'staff' => $staff
            ]);
        }

        return redirect()->back()->with('success', 'Staff member updated successfully.');
    }

    /**
     * Delete a staff member.
     */
    public function destroy(Request $request, $id)
    {
        $staff = Staff::findOrFail($id);
        $staff->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Staff member deleted successfully.'
            ]);
        }

        return redirect()->back()->with('success', 'Staff member deleted successfully.');
    }
}
