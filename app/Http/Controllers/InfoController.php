<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Info;
use Illuminate\Support\Facades\Storage;


class InfoController extends Controller
{
    public function show()
    {
        $info = Info::first(); // Esto asume que solo hay un registro en la tabla 'info'.
    
        if ($info) {
            return response()->json($info);
        } else {
            return response()->json(['error' => 'No se encontró la información.'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $info = Info::findOrFail($id);

        logger("Datos recibidos (array):", ['data' => $request->all()]);

        if ($request->hasFile('banner')) {
            // Solo procede si el archivo es diferente al actual
            $currentBannerPath = str_replace(Storage::url('/'), '', $info->banner);
            $banner = $request->file('banner');

            // Opción para comparar si es necesario, por ejemplo, comparar tamaños o nombres
            if (!$currentBannerPath || $banner->getClientOriginalName() != basename($currentBannerPath)) {
                $bannerPath = $banner->store('public/banners');
                $info->banner = Storage::url($bannerPath);
            }
        }

        $email = $request->input('email');
        if ($email) {
            $info->email = $email;
            logger("Nuevo email:", ['email' => $info->email]);
        }

        $info->save();

        return response()->json($info);
    }

}
