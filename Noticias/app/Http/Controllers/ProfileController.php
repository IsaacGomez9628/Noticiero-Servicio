<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Person;
use App\Models\Contact;
use App\Models\User;
use App\Models\Gender;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Muestra el formulario para editar el perfil del usuario.
     */
    public function edit()
    {
        $user = Auth::user();
        $person = Person::where('user_id', $user->id)->first();
        
        // Obtener el contacto (teléfono) del usuario si existe
        $contact = null;
        if ($person) {
            $contact = Contact::where('person_id', $person->id)
                ->where('phone', '!=', null)
                ->first();
        }

        // Obtener todos los géneros para el select
        $genders = Gender::all();
        
        // Devolver la vista con todos los datos necesarios
        return Inertia::render('Dashboard/EditProfile', [
            'user' => $user,
            'person' => $person,
            'phone' => $contact ? $contact->phone : '',
            'genders' => $genders
        ]);
    }

    /**
     * Actualiza el perfil del usuario.
     */
    public function update(Request $request)
    {
        // Validar los datos del formulario
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'second_last_name' => 'nullable|string|max:50',
            'birth_date' => 'required|date',
            'gender_id' => 'required|exists:genders,id',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|max:100|unique:users,email,' . Auth::id(),
        ], [
            'required' => 'El campo :attribute es obligatorio.',
            'email' => 'El formato del correo electrónico no es válido.',
            'unique' => 'El correo electrónico ya está en uso.',
            'exists' => 'El género seleccionado no es válido.',
            'max' => 'El campo :attribute no debe exceder :max caracteres.',
            'date' => 'El formato de fecha no es válido.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $user = User::find(Auth::id());
        
        // Actualizar email del usuario si cambió
        if ($user && $user->email !== $request->email) {
            $user->email = $request->email;
            $user->save();
        }
        
        // Actualizar persona
        $person = Person::where('user_id', $user->id)->first();
        if ($person) {
            $person->name = $request->name;
            $person->last_name = $request->last_name;
            $person->second_last_name = $request->second_last_name;
            $person->birthdate = $request->birthdate;
            $person->gender_id = $request->gender_id;
            
            // Calcular edad basada en la fecha de nacimiento
            $birthdate = new \DateTime($request->birthdate);
            $today = new \DateTime();
            $age = $birthdate->diff($today)->y;
            $person->age = $age;
            
            $person->save();
            
            // Actualizar o crear contacto para teléfono
            if ($request->filled('phone')) {
                $contact = Contact::where('person_id', $person->id)
                    ->where('phone', '!=', null)
                    ->first();
                
                if (!$contact) {
                    $contact = new Contact();
                    $contact->person_id = $person->id;
                }
                $contact->phone = $request->phone;
                $contact->save();
            }
        }
        
        return redirect()->route('perfil.edit')->with('success', 'Datos actualizados correctamente');
    }
}