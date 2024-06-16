<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\SaleTranslate;
use App\Models\SaleGallery;
use App\Models\SaleURL;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $locale = $request->get('lang', 'en'); // Obtiene el parámetro 'lang' o utiliza 'en' por defecto.
        $sales = Sale::with(['saleTranslates' => function ($query) use ($locale) {
            $query->where('locale', $locale);
        }, 'saleGalleries', 'saleURLs'])->get();

        return response()->json($sales);
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

        // Validación
        $request->validate([
            'cover' => 'required|image',
            'translations' => 'required|string',
            'urls.*.url' => 'required|string',
            'urls.*.store' => 'required|string',
            'galleries' => 'sometimes|array',
            'galleries.*' => 'image',
        ]);

        logger('Data validated');

        try {
            // Asegúrate de que la instancia de Sale se crea correctamente
            $sale = new Sale;
            

            // Verifica si hay un archivo de cover y guárdalo
            if ($request->hasFile('cover')) {
                $coverPath = $request->file('cover')->store('sales', 'public');
                $sale->cover = Storage::url($coverPath);
                $sale->save();
                logger('Sale saved successfully with ID:', ['id' => $sale->id]);
            } else {
                logger('No cover image received');
            }

            // Decodificar JSON para las traducciones
            $translations = json_decode($request->input('translations'), true);
            logger('Translations received:', $translations);

            foreach ($translations as $locale => $translation) {
                logger('Processing translation:', ['locale' => $locale, 'data' => $translation]);
                $sale->saleTranslates()->create([
                    'locale' => $locale,
                    'title' => $translation['title'],
                    'description' => $translation['description']
                ]);
            }

            // logger('URLs received:', $request->urls);
            if (!empty($request->urls)) {
                foreach ($request->urls as $urlData) {
                    $sale->saleURLs()->create([
                        'url' => $urlData['url'],
                        'store' => $urlData['store'],
                    ]);
                }
            } else {
                logger('No urls received');
            }

            // logger('Galleries received:', $request->galleries);
            if ($request->hasFile('galleries')) {
                $galleryFiles = $request->file('galleries');
                logger('Galleries received:', $galleryFiles);

                foreach ($galleryFiles as $imageFile) {
                    $imagePath = $imageFile->store('sales_gallery', 'public');
                    $sale->saleGalleries()->create(['url' => Storage::url($imagePath)]);
                    logger('Gallery image stored:', ['path' => $imagePath]);
                }
            } else {
                logger('No galleries received');
            }


            return response()->json($sale);
        } catch (\Exception $e) {
            logger('Error creating sale:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error creating sale: ' . $e->getMessage()], 500);
        }
    }




    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $sale = Sale::with('saleTranslates', 'saleURLs', 'saleGalleries')->find($id);
        if (!$sale) {
            return response()->json(['message' => 'Sale not found'], 404);
        }
        return response()->json($sale);
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
        try {
            \Log::info('Iniciando la actualización del sale con ID: ' . $id);
            \Log::info('Datos recibidos:', [$request->all()]);
            \Log::info('IDs de imágenes existentes recibidos:', $request->input('existingGalleries'));

            $sale = Sale::findOrFail($id);
            \Log::info('La Sale que se actualiza es: ' . $sale);

            // Valida los datos de entrada
            $validatedData = $request->validate([
                'translations.*.title' => 'required|string',
                'translations.*.description' => 'required|string'
            ]);
            \Log::info('Validación finalizada');

            if ($request->hasFile('cover')) {
                $coverPath = $request->file('cover')->store('sales', 'public');
                $sale->cover = Storage::url($coverPath);
                \Log::info('Cover actualizado exitosamente.', ['id' => $sale->id, 'cover' => $sale->cover]);
            } else {
                \Log::info('No se recibió nuevo archivo de cover.');
            }

            if ($request->has('existingGalleries')) {
                $existingGalleries = $request->input('existingGalleries');
                \Log::info('existingGalleries recibidos:', [$existingGalleries]);

                $existingIds = array_column($existingGalleries, 'id');
                $allGalleryIds = $sale->saleGalleries()->pluck('id')->toArray();

                $galleriesToDelete = array_diff($allGalleryIds, $existingIds);
                foreach ($galleriesToDelete as $galleryId) {
                    $gallery = SaleGallery::find($galleryId);
                    if ($gallery) {
                        \Log::info('Ruta del archivo a eliminar:', ['url' => $gallery->url]);
                        $correctPath = substr($gallery->url, strlen('/storage/'));
                        Storage::disk('public')->delete($correctPath);
                        if (!Storage::exists($correctPath)) {
                            \Log::info('Archivo eliminado:', ['url' => $correctPath]);
                        } else {
                            \Log::info('Archivo no encontrado, no se pudo eliminar:', ['url' => $correctPath]);
                        }
                        $gallery->delete();
                    }
                }

                foreach ($existingGalleries as $galleryData) {
                    $gallery = SaleGallery::find($galleryData['id']);
                    if ($gallery) {
                        $gallery->save();
                        \Log::info('Galería actualizada:', ['id' => $galleryData['id']]);
                    }
                }
            }

            if ($request->hasFile('newGalleries')) {
                foreach ($request->file('newGalleries') as $file) {
                    if ($file instanceof \Illuminate\Http\UploadedFile) {
                        $galleryPath = $file->store('sales_gallery', 'public');
                        $sale->saleGalleries()->create(['url' => Storage::url($galleryPath)]);
                        \Log::info('Se añadió la galería:', ['path' => $galleryPath]);
                    }
                }
            }

            if ($request->has('urls')) {
                $urls = $request->input('urls');
                \Log::info('urls recibidos:', [$urls]);
    
                // Asegúrate de que urls sea un array
                if (!is_array($urls)) {
                    throw new \Exception('expected urls to be an array');
                }
    
                $sale->saleURLs()->delete();
                foreach ($urls as $url) {
                    $sale->saleURLs()->create([
                        'url' => $url['url'],
                        'store' => $url['store'],
                    ]);
                }
            }

            // Actualizar traducciones
            if ($request->has('translations')) {
                $translations = json_decode($request->input('translations'), true);
                \Log::info('Traducciones después de json_decode:', [$translations]);
    
                foreach ($translations as $locale => $data) {
                    $translation = $sale->saleTranslates()->where('locale', $locale)->first();
                    if ($translation) {
                        $translation->update($data);
                    } else {
                        $sale->saleTranslates()->create([
                            'locale' => $locale,
                            'title' => $data['title'],
                            'description' => $data['description'],
                        ]);
                    }
                }
            }

            $sale->save();

            return response()->json($sale);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($e->errors(), 422);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar la información:', ['exception' => $e]);
            return response()->json(['error' => 'Error al actualizar la información.'], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $sale = Sale::findOrFail($id);
        // Eliminar recursos relacionados aquí (archivos, URLs, etc.)
        $sale->delete();
        return response()->json(['message' => 'Sale successfully deleted']);
    }
}
