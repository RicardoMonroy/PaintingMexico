<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\SaleTranslate;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SaleTranslate>
 */
class SaleTranslateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'locale' => $this->faker->randomElement(['en', 'es']),
            'title' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph,
        ];
    }
}
