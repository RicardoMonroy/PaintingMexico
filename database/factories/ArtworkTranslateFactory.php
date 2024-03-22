<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ArtworkTranslate;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ArtworkTranslate>
 */
class ArtworkTranslateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'locale' => $this->faker->randomElement(['es', 'en']),
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            // 'artwork_id' se asignará al crear las instancias
        ];
    }
}
