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
use Illuminate\Support\Facades\Log;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
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

    public function show($userId)
    {
        // Lógica para mostrar el perfil del usuario
    }


    /**
     * Update the user's profile information.
     */
    public function update(Request $request, $id)
    {
        logger('Request data:', $request->all());

        // Buscar o crear el perfil basado en el userId
        $profile = Profile::firstOrCreate(
            ['user_id' => $id],
            ['user_id' => $id] // Asegurarse de que el user_id se establezca si se crea un nuevo perfil
        );
        logger('Profile:', $profile->toArray()); // Convertir el perfil a un array

        $validated = $request->validate([
            'avatar' => 'nullable|image',
            'description_en' => 'required|string',
            'description_es' => 'required|string',
        ]);

        if ($request->hasFile('avatar')) {
            // Eliminar el avatar anterior si existe
            if ($profile->avatar) {
                $oldAvatarPath = str_replace('/storage/', '', $profile->avatar);
                Storage::disk('public')->delete($oldAvatarPath);
            }
    
            // Almacenar el nuevo avatar en la carpeta artworks
            $avatarPath = $request->file('avatar')->store('artworks', 'public');
            $profile->avatar = '/storage/' . $avatarPath;
        }

        $profile->save();

        $profile->translates()->updateOrCreate(
            ['locale' => 'en'],
            ['description' => $validated['description_en']]
        );

        $profile->translates()->updateOrCreate(
            ['locale' => 'es'],
            ['description' => $validated['description_es']]
        );

        return response()->json(['message' => 'Profile updated successfully']);
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
