<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Info>
 */
class InfoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'banner' => asset('storage/banners/DefaultBanner.png'), // Genera una imagen de banner
            'email' => 'contacto@paintingmexico.com', // Correo de contacto estático
        ];
    }
}
