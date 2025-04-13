<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailIsVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        if (!$request->user() || !$request->user()->email_verified) {
            auth()->guard()->logout();
            return redirect()->route('verification.notice')
                ->with('error', 'Debes verificar tu correo electrónico antes de acceder.');
        }

        return $next($request);
    }
}
