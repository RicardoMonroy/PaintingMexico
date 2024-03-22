<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Post;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'cover' => $this->faker->imageUrl(), // Usa $this->faker aquí
            'user_id' => function () {
                return \App\Models\User::inRandomOrder()->first()->id;
            },
        ];
    }
}
