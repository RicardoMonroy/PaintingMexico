<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Artwork;
use App\Models\Section;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ArtworkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $locale = $request->get('lang', 'en');
        $artworks = Artwork::with(['translations' => function ($query) use ($locale) {
            $query->where('locale', $locale);
        }, 'user'])->orderByDesc('created_at')->get();

        $sections = Section::with(['translations' => function ($query) use ($locale) {
            $query->where('locale', $locale);
        }])->orderByDesc('created_at')->get();

        return response()->json(['artworks' => $artworks, 'sections' => $sections]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        logger('Request data:', $request->all());

        $validatedData = $request->validate([
            'front' => 'required|image',
            'translations' => 'required|string',
            'videos' => 'sometimes|array',
            'images' => 'sometimes|array', // Valida que las imágenes sean un arreglo
            'images.*' => 'image', // Valida que cada elemento del arreglo sea una imagen
            'background_color' => 'required|string|max:7',
            'section' => 'nullable|exists:sections,id'
        ]);

        logger('Validated data:', $validatedData);

        try {
            $artwork = new Artwork();
            $artwork->user_id = auth()->id();
            $artwork->background_color = $request->input('background_color'); // Asigna el color de fondo
            $artwork->section_id = $request->input('section');

            // Almacena la imagen 'front' y guarda la URL pública
            if ($request->hasFile('front')) {
                $frontPath = $request->file('front')->store('artworks', 'public');
                $artwork->front = Storage::url($frontPath);
            }
            
            $artwork->save();
    
            // Decodifica la cadena JSON de translations
            $translations = json_decode($request->get('translations'), true);
    
            // Inserta cada traducción
            foreach ($translations as $locale => $translationData) {
                $artwork->translations()->create([
                    'locale' => $locale,
                    'title' => $translationData['title'],
                    'description' => $translationData['description']
                ]);
            }

            // Inserta los videos si están presentes en la solicitud
            if ($request->has('videos')) {
                foreach ($request->input('videos') as $videoUrl) {
                    if (!empty($videoUrl)) { // Asegúrate de que la URL del video no esté vacía
                        $artwork->videos()->create(['url' => $videoUrl]);
                    }
                }
            }

            // Inserta las imágenes
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $imageFile) {
                    $imagePath = $imageFile->store('artwork_images', 'public');
                    $artwork->images()->create(['url' => Storage::url($imagePath)]);
                }
            }
    
            logger('Artwork saved:', ['artwork' => $artwork->toArray()]);
    
            return response()->json($artwork);
        } catch (\Exception $e) {
            logger('Error saving artwork:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error saving artwork'], 500);
        }
    }




    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $artwork = Artwork::with(['translations', 'images', 'videos'])->find($id);
        if (!$artwork) {
            return response()->json(['message' => 'Artwork not found'], 404);
        }
        return response()->json($artwork);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        \Log::info('Iniciando la actualización del artwork con ID: ' . $id);
        \Log::info('Datos recibidos:', $request->all());
        // \Log::info('IDs de imágenes existentes recibidos:', $request->input('existingImages'));


        // Buscar el artwork por ID
        $artwork = Artwork::findOrFail($id);

        // Validar la solicitud (asumiendo que tienes reglas de validación para los campos)
        $validatedData = $request->validate([
            'background_color' => 'required|string',
            'translations.*.title' => 'required|string',
            'section' => 'nullable|exists:sections,id'
        ]);

        // Actualizar los campos del modelo
        $artwork->background_color = $request->input('background_color');
        $artwork->section_id = $request->input('section');

        // Actualizar la imagen principal si se ha enviado una nueva
        if ($request->hasFile('front')) {
            $frontImagePath = $request->file('front')->store('public/artworks');
            $artwork->front = Storage::url($frontImagePath);
            \Log::info('Imagen principal actualizada:', ['path' => $frontImagePath]);
        }

        // Actualizar imágenes asociadas
        // Procesar las imágenes existentes
        if ($request->has('existingImages')) {
            // Extraer los IDs de las imágenes existentes
            $existingIds = array_column($request->existingImages, 'id'); 
            $allImageIds = $artwork->images()->pluck('id')->toArray(); // Obtener todos los IDs de imágenes asociadas
    
            $imagesToDelete = array_diff($allImageIds, $existingIds);
            foreach ($imagesToDelete as $imageId) {
                $image = Image::find($imageId);
                if ($image) {
                    \Log::info('Ruta del archivo a eliminar:', ['url' => $image->url]);
                    $correctPath = substr($image->url, strlen('/storage/')); // Esto quita '/storage/' del inicio
                    Storage::disk('public')->delete($correctPath);
                    if (Storage::exists($correctPath)) {
                        \Log::info('Archivo eliminado: ', ['url' => $correctPath]);
                    } else {
                        \Log::info('Archivo no encontrado, no se pudo eliminar:', ['url' => $correctPath]);
                    }
                    
                    $image->delete();
                }
            }
    
            // Actualizar las descripciones de las imágenes existentes
            foreach ($request->existingImages as $imageData) {
                $image = Image::find($imageData['id']);
                if ($image) {
                    $image->description = $imageData['description'];
                    $image->save();
                    \Log::info('Imagen actualizada:', ['id' => $imageData['id'], 'description' => $imageData['description']]);
                }
            }
        }

        // Añadir nuevas imágenes
        if ($request->has('newImages')) {
            foreach ($request->newImages as $file) {
                // Asegúrate de que el archivo es una instancia de UploadedFile
                if ($file instanceof \Illuminate\Http\UploadedFile) {
                    $imagePath = $file->store('public/artwork_images');
                    $artwork->images()->create(['url' => Storage::url($imagePath)]);
                    \Log::info('Se añadió la imagen:', ['path' => $imagePath]);
                }
            }
        }
            

        // Actualizar vídeos
        // Asegúrate de tener una lógica adecuada para actualizar o añadir nuevos vídeos
        if ($request->has('videos')) {
            // Eliminar los vídeos existentes
            $artwork->videos()->delete();

            // Añadir los nuevos vídeos
            foreach ($request->input('videos') as $videoUrl) {
                $artwork->videos()->create(['url' => $videoUrl]);
                \Log::info('Video añadido:', ['url' => $videoUrl]);
            }
        }

        // Actualizar traducciones
        if ($request->has('translations')) {
            foreach ($request->input('translations') as $locale => $data) {
                $translation = $artwork->translations()->where('locale', $locale)->first();
                if ($translation) {
                    $translation->update($data);
                }
            }
        }

        // Guardar los cambios en la base de datos
        $artwork->save();

        // Retornar una respuesta, podría ser el objeto actualizado o una redirección
        return response()->json($artwork);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $artwork = Artwork::findOrFail($id);
            
            // Opcional: eliminar recursos relacionados, como imágenes, traducciones y videos, si es necesario
            $artwork->images()->delete();
            $artwork->translations()->delete();
            $artwork->videos()->delete();
            
            $artwork->delete();

            return response()->json(['message' => 'Artwork eliminado con éxito']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar el artwork'], 500);
        }
    }

}
