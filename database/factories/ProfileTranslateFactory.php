<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ProfileTranslate;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProfileTranslate>
 */
class ProfileTranslateFactory extends Factory
{
    protected $model = ProfileTranslate::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'locale' => $this->faker->randomElement(['en', 'es']),
            'description' => $this->faker->paragraph,
            // 'profile_id' se asignará al crear las instancias
        ];
    }
}
