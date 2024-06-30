<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\SectionTranslation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SectionController extends Controller
{
    public function index(Request $request)
    {
        $language = $request->query('lang', 'en');
        $sections = Section::with(['translations' => function ($query) use ($language) {
            $query->where('locale', $language);
        }])->get();

        return response()->json($sections);
    }

    public function store(Request $request)
    {
        \Log::info('Datos recibidos:', $request->all());

        $validatedData = $request->validate([
            'translations' => 'required|array',
            'translations.*.locale' => 'required|string',
            'translations.*.name' => 'required|string',
        ]);
    
        $section = Section::create();
    
        foreach ($validatedData['translations'] as $translation) {
            SectionTranslation::create([
                'section_id' => $section->id,
                'locale' => $translation['locale'],
                'name' => $translation['name'],
            ]);
        }
    
        return response()->json($section->load('translations'), 201);
    }

    public function show($id)
    {
        $section = Section::with('translations')->findOrFail($id);
        return response()->json($section);
    }

    public function update(Request $request, Section $section, $id)
    {
        // Registrar los datos recibidos
        \Log::info('Datos recibidos:', $request->all());

        // Registrar el ID de la sección que se va a actualizar
        \Log::info('Section ID:', ['id' => $id]);

        $section = Section::findOrFail($id);

        // Validar la solicitud
        $request->validate([
            'translations' => 'required|array',
            'translations.*.locale' => 'required|string',
            'translations.*.name' => 'required|string',
        ]);

        // Eliminar las traducciones actuales
        $section->translations()->delete();

        // Crear las nuevas traducciones y asegurarse de pasar el `section_id`
        foreach ($request->translations as $translation) {
            $section->translations()->create([
                'locale' => $translation['locale'],
                'name' => $translation['name'],
                'section_id' => $id,
            ]);
        }

        // Devolver la respuesta JSON con las traducciones cargadas
        return response()->json($section->load('translations'));
    }


    public function destroy(Section $section)
    {
        $section->delete();
        return response()->json(null, 204);
    }
}
