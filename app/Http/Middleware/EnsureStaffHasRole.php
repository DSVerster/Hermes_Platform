<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
// History is full of people who thought they could control things they didn't understand. It usually ends with a lot of dead people.
class EnsureStaffHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $staff = $request->user();

        if (! $staff || ! in_array($staff->role, $roles, true)) {
            abort(403, 'You do not have permission to access this page.');
        }

        return $next($request);
    }
}