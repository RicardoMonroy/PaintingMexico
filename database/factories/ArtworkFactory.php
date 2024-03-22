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
            'price' => $this->faker->randomFloat(2, 10, 5000), // Genera un precio aleatorio entre 10 y 5000
            'user_id' => function () {
                return \App\Models\User::inRandomOrder()->first()->id ?? \App\Models\User::factory()->create()->id;
            },
        ];
    }
}
