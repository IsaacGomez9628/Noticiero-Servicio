<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class BaseController extends Controller
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (Auth::check() && !\Illuminate\Support\Facades\Auth::user()->email_verified) {
                Auth::logout();
                return redirect()->route('verification.notice')
                    ->with('error', 'Debes verificar tu correo electrónico antes de acceder.');
            }
            return $next($request);
        });
    }
}