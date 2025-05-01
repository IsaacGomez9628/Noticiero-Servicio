<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $fullName = null;
    
        // Verificamos qué tipo de usuario es y cargamos las relaciones apropiadas
        if ($user) {
            // Añadir un log para debug
            \Log::info('Tipo de usuario autenticado: ' . get_class($user));
            
            if (get_class($user) === 'App\Models\User') {
                // Usuario normal
                $user->load('person');
                $fullName = $user->person->full_name ?? null;
            } elseif (get_class($user) === 'App\Models\Admin') {
                // Usuario admin
                $fullName = $user->name ?? $user->email;
            }
        }
        
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'email' => $user->email,
                    'full_name' => $fullName ?? $user->email, // Si no hay nombre, usa el email
                    'is_admin' => method_exists($user, 'isAdmin') ? $user->isAdmin() : false,
                    'is_super_admin' => method_exists($user, 'isSuperAdmin') ? $user->isSuperAdmin() : false,
                    'is_institutional' => method_exists($user, 'isInstitutional') ? $user->isInstitutional() : false,
                    'is_personal' => method_exists($user, 'isPersonal') ? $user->isPersonal() : false,
                ] : null,
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}