<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use App\Http\Requests\UpdateStaffRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
class StaffController extends Controller
{
    public function index()
    {
        return Inertia::render('Staff/Index', [
            'title' => 'Staff',
            'staff' => Staff::orderBy('name')->get(['staff_id', 'name', 'surname', 'email_account', 'role']),
        ]);
    }

    public function edit(Staff $staffMember)
    {
        return Inertia::render('Staff/Edit', [
            'title' => 'Edit Staff Member',
            'staffMember' => $staffMember,
        ]);
    }

    public function update(UpdateStaffRequest $request, Staff $staffMember)
    {
        $staffMember->update($request->validated());

        return redirect()->route('staff.index')->with('success', 'Staff member updated.');
    }

    /**
     * Issue a Sanctum API token for non-browser clients.
     */
    public function issueToken(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'device_name' => ['required', 'string'],
        ]);

        $staff = Staff::where('email_account', $request->email)->first();

        if (! $staff || ! Hash::check($request->password, $staff->password_hash)) {
            throw ValidationException::withMessages([
                'email' => ['These credentials do not match our records.'],
            ]);
        }

        return response()->json([
            'token' => $staff->createToken($request->device_name)->plainTextToken,
        ]);
    }

    public function revokeToken(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Token revoked.']);
    }
}