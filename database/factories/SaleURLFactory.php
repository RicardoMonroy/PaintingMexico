<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\SaleURL;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SaleURL>
 */
class SaleURLFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'store' => $this->faker->company,
            'url' => $this->faker->url,
        ];
    }
}
