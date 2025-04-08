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
        
        // Si el usuario está autenticado, carga explícitamente la relación person
        if ($user) {
            // Carga la relación person si aún no está cargada
            if (!$user->relationLoaded('person')) {
                $user->load('person');
            }
            
            // Asegúrate de que la persona exista antes de intentar acceder a sus atributos
            $fullName = null;
            if ($user->person) {
                $fullName = $user->person->getFullNameAttribute();
            }
        }
        
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'email' => $user->email,
                    'full_name' => $fullName ?? $user->email, // Si no hay nombre, usa el email
                    'is_admin' => $user->isAdmin(),
                    'is_super_admin' => $user->isSuperAdmin(),
                    'is_institutional' => $user->isInstitutional(),
                    'is_personal' => $user->isPersonal(),
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