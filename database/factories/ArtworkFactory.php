<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Artwork;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Artwork>
 */
class ArtworkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'front' => '/storage/artworks/ArtworDefaulg.png',
            'background_color' => '#F2F2F2',
            'user_id' => function () {
                return \App\Models\User::inRandomOrder()->first()->id ?? \App\Models\User::factory()->create()->id;
            },
        ];
    }
}
