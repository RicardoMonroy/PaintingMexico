<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Video>
 */
class VideoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'url' => 'https://www.youtube.com/watch?v=EjNe5EJ1cAQ', // Genera una URL aleatoria
            // 'artwork_id' se asignará al crear las instancias
        ];
    }
}
