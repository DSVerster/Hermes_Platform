<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class SettingsController extends Controller
{
    /**
     * Display the settings index page with the authenticated user's data and current settings.
     */
    public function index()
    {
        // Fetch all settings from the database as a simple key-value array
        $settings = Setting::pluck('value', 'key')->toArray();

        return inertia('settings/Index', [
            'user' => Auth::user(),
            'settings' => $settings,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'email_account' => [
                'required', 
                'email', 
                'max:255', 
                Rule::unique('staff', 'email_account')->ignore($user->staff_id, 'staff_id')
            ],
        ]);

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Update application-level settings.
     */
    public function updateApplication(Request $request)
    {
        $validated = $request->validate([
            'companyName' => ['required', 'string', 'max:255'],
            'contactEmail' => ['required', 'email', 'max:255'],
            'contactPhone' => ['required', 'string', 'max:50'],
            'address' => ['required', 'string', 'max:500'],
        ]);

        // Save each setting to the database using updateOrCreate
        Setting::updateOrCreate(['key' => 'companyName'], ['value' => $validated['companyName']]);
        Setting::updateOrCreate(['key' => 'contactEmail'], ['value' => $validated['contactEmail']]);
        Setting::updateOrCreate(['key' => 'contactPhone'], ['value' => $validated['contactPhone']]);
        Setting::updateOrCreate(['key' => 'address'], ['value' => $validated['address']]);
        
        return back()->with('success', 'Application settings saved.');
    }

    /**
     * Update parcel configuration settings.
     */
    public function updateParcel(Request $request)
    {
        $validated = $request->validate([
            'autoTrackingNumber' => ['required', 'boolean'],
            'trackingPrefix' => ['required', 'string', 'max:10'],
        ]);

        // Save each setting to the database
        Setting::updateOrCreate(['key' => 'autoTrackingNumber'], ['value' => $validated['autoTrackingNumber'] ? '1' : '0']);
        Setting::updateOrCreate(['key' => 'trackingPrefix'], ['value' => $validated['trackingPrefix']]);
        
        return back()->with('success', 'Parcel configuration saved.');
    }
}