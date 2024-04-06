<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;    
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\Profile;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;


class ProfileController extends Controller
{
    public function show(User $user)
    {
        try {
            // Intenta obtener el perfil del usuario, pero no lances una excepción si no se encuentra.
            $profile = $user->profile()->with('translates')->first();
    
            // Si no hay perfil, puedes retornar un estado específico o un objeto vacío.
            if (!$profile) {
                return response()->json(['message' => 'Perfil no encontrado'], 404);
            }
    
            return response()->json($profile);
        } catch (\Exception $e) {
            Log::error("Error al cargar el perfil: " . $e->getMessage());
            return response()->json(['error' => 'Error al cargar el perfil'], 500);
        }
    }

    public function store(Request $request)
    {
        Log::info('Request data:', $request->all());

        $request->validate([
            'avatar' => 'sometimes|image|mimes:jpg,jpeg,png',
            'description_en' => 'required|string',
            'description_es' => 'required|string',
        ]);

        $profile = new Profile([
            'user_id' => $request->userId,
        ]);

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('public/avatars');
            $profile->avatar = Storage::url($avatarPath);
        } else {
            // Si no hay archivo cargado, establecer avatar como null o un valor predeterminado
            $profile->avatar = null;
        }

        $profile->save();

        $profile->translates()->createMany([
            ['locale' => 'en', 'description' => $request->description_en],
            ['locale' => 'es', 'description' => $request->description_es],
        ]);

        return response()->json($profile->load('translates'), 201);
    }


    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(Request $request, $userId)
    {
        Log::info('Update request data:', $request->all());

        // Validación de los datos recibidos
        $validated = $request->validate([
            'avatar' => 'sometimes|image|mimes:jpg,jpeg,png',
            'description_en' => 'required|string',
            'description_es' => 'required|string',
        ]);

        // Buscar el perfil del usuario por userId o crear uno nuevo
        $profile = Profile::updateOrCreate(
            ['user_id' => $userId],
            ['avatar' => $request->hasFile('avatar') ? Storage::url($request->file('avatar')->store('public/avatars')) : null]
        );

        // Si hay un archivo de avatar, actualizarlo
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('public/avatars');
            $profile->avatar = Storage::url($avatarPath);
            $profile->save();
        }

        // Actualizar o crear las traducciones para 'en' y 'es'
        $profile->translates()->updateOrCreate(
            ['locale' => 'en'],
            ['description' => $validated['description_en']]
        );
        $profile->translates()->updateOrCreate(
            ['locale' => 'es'],
            ['description' => $validated['description_es']]
        );

        // Log the updated profile data
        Log::info('Updated profile data:', $profile->fresh()->toArray());

        return response()->json($profile->load('translates'), 201);
    }


    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
