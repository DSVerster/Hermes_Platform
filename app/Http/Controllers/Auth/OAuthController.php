<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class OAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $staff = Staff::firstOrCreate(
            ['email_account' => $googleUser->getEmail()],
            [
                'name' => $googleUser->user['given_name'] ?? $googleUser->getName(),
                'surname' => $googleUser->user['family_name'] ?? '',
                'password_hash' => bcrypt(Str::random(40)),
                'role' => 'front_desk',
                'email_verified_at' => now(),
            ]
        );

        Auth::login($staff, remember: true);

        return redirect()->intended(route('dashboard'));
    }
}