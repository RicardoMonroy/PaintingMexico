<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Artwork;
use App\Models\Video;

class VideosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener todas las obras de arte existentes
        $artworks = Artwork::all();

        // Para cada obra de arte, generar 1 video
        $artworks->each(function ($artwork) {
            Video::factory()->create([
                'artwork_id' => $artwork->id, // Asigna el ID de la obra de arte al video
            ]);
        });
    }
}
