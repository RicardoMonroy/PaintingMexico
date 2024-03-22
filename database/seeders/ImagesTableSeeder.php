<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Artwork;
use App\Models\Image;

class ImagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $artworks = Artwork::all();

        $artworks->each(function ($artwork) {
            // Para cada obra de arte, crear 3 imágenes
            for ($i = 0; $i < 3; $i++) {
                Image::create([
                    'artwork_id' => $artwork->id,
                    'url' => 'https://via.placeholder.com/640x480.png/00ff77?text=artwork+' . $i, // Ejemplo de URL
                ]);
            }
        });
    }
}
