<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\SaleGallery;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SaleGallery>
 */
class SaleGalleryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'url' => $this->faker->imageUrl(640, 480, 'business'), // Ejemplo de URL
            // 'sales_idsales' se asignará al crear las instancias
        ];
    }
}
