<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\PostTranslate;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PostTranslate>
 */
class PostTranslateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'locale' => $this->faker->randomElement(['es', 'en']), // Usa $this->faker aquí
            'title' => $this->faker->sentence,
            'content' => $this->faker->paragraph,
        ];
    }
}
