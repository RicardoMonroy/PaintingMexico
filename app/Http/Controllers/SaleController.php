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
        \Log::info('Iniciando la actualización del sale con ID: ' . $id);
        \Log::info('Datos recibidos:', $request->all());

        $sale = Sale::findOrFail($id);

        // Verifica si hay un archivo de cover y procesa la carga
        if ($request->hasFile('cover')) {
            // Almacena el archivo en el disco 'public' y guarda la ruta en la base de datos
            $coverPath = $request->file('cover')->store('sales', 'public');
            $sale->cover = Storage::url($coverPath);
            $sale->save();

            \Log::info('Cover actualizado exitosamente.', ['id' => $sale->id, 'cover' => $sale->cover]);
        } else {
            \Log::info('No se recibió nuevo archivo de cover.');
        }

        $translations = json_decode($request->input('translations'), true);
        foreach ($translations as $locale => $translation) {
            $trans = $sale->saleTranslates()->where('locale', $locale)->first();
            if ($trans) {
                $trans->title = $translation['title'];
                $trans->description = $translation['description'];
                $trans->save();
            } else {
                $sale->saleTranslates()->create([
                    'locale' => $locale,
                    'title' => $translation['title'],
                    'description' => $translation['description'],
                ]);
            }
        }

        // Si se recibe una nueva galería, primero elimina las anteriores
        if ($request->has('updateGalleries') && $request->updateGalleries == 'true') {
            // Asumiendo que `sale_id` es la columna que relaciona las galerías con el sale
            SaleGallery::where('sales_idsales', $id)->delete();
            if ($request->hasFile('galleries')) {
                foreach ($request->file('galleries') as $galleryFile) {
                    $galleryPath = $galleryFile->store('sales_gallery', 'public');
                    $sale->saleGalleries()->create([
                        'url' => Storage::url($galleryPath),
                    ]);
                }
            }
        }

        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('sales', 'public');
            $sale->cover = Storage::url($coverPath);
        }

        // Actualizar URLs
        // Primero elimina las URLs existentes
        $sale->saleURLs()->delete();

        // Luego añade las nuevas URLs
        foreach ($request->urls as $url) {
            $sale->saleURLs()->create([
                'url' => $url['url'],
                'store' => $url['store'],
            ]);
        }

        return response()->json($sale);        
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
