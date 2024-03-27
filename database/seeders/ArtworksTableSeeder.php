<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Artwork;

class ArtworksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear 30 obras de arte
        Artwork::factory()->count(15)->create()->each(function ($artwork) {
            // Para cada obra de arte, crear una traducción en inglés y una en español
            $artwork->translations()->saveMany(\App\Models\ArtworkTranslate::factory()->count(1)->make(['locale' => 'en']));
            $artwork->translations()->saveMany(\App\Models\ArtworkTranslate::factory()->count(1)->make(['locale' => 'es']));
        });
    }
}
