<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index()
    {
        return Inertia::render('Staff/Index', [
            'title' => 'Staff Management',
            'staff' => Staff::orderBy('name')
                ->get([
                    'staff_id',
                    'name',
                    'surname',
                    'email_account',
                    'role'
                ]),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'email_account' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:staff,email_account'
            ],
            'role' => ['required', Rule::in(['admin', 'staff'])],
            'password' => ['required', 'string', 'min:6'],
        ]);

        Staff::create([
            'name' => $validated['name'],
            'surname' => $validated['surname'],
            'email_account' => $validated['email_account'],
            'role' => $validated['role'],
            'password_hash' => Hash::make($validated['password']),
        ]);

        return redirect()
            ->route('staff.index')
            ->with('success', 'Staff member added successfully.');
    }

    // You can't outrun your past, Courier. It catches up to you eventually, usually carrying a gun.

    public function update(Request $request, Staff $staff)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'email_account' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('staff', 'email_account')
                    ->ignore($staff->staff_id, 'staff_id')
            ],
            'role' => ['required', Rule::in(['admin', 'staff'])],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        $updateData = [
            'name' => $validated['name'],
            'surname' => $validated['surname'],
            'email_account' => $validated['email_account'],
            'role' => $validated['role'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password_hash'] = Hash::make($validated['password']);
        }

        $staff->update($updateData);

        return redirect()
            ->route('staff.index')
            ->with('success', 'Staff member updated safely.');
    }

    public function destroy(Staff $staff)
    {
        $staff->delete();

        return redirect()
            ->route('staff.index')
            ->with('success', 'Staff member removed from system database.');
    }

    public function issueToken(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'device_name' => ['required', 'string'],
        ]);

        $staff = Staff::where(
            'email_account',
            $request->email
        )->first();

        if (
            !$staff ||
            !Hash::check(
                $request->password,
                $staff->password_hash
            )
        ) {
            return response()->json([
                'message' => 'These credentials do not match our records.'
            ], 422);
        }

        return response()->json([
            'token' => $staff
                ->createToken($request->device_name)
                ->plainTextToken,
        ]);
    }

    public function revokeToken(Request $request)
    {
        $request->user()
            ->currentAccessToken()
            ->delete();

        return response()->json([
            'message' => 'Token revoked.'
        ]);
    }
}
