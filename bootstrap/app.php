<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
<<<<<<< HEAD
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
=======
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
>>>>>>> c4faf9af31407980159f0789ffe960231b04ea6f
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
<<<<<<< HEAD

    ->withMiddleware(function (Middleware $middleware) {
        $middleware->validateCsrfTokens(except: [
            //empty
        ]);
    })




=======
>>>>>>> c4faf9af31407980159f0789ffe960231b04ea6f
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
