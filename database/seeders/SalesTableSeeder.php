<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Sale;

class SalesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear 10 ventas
        Sale::factory()->count(10)->create()->each(function ($sale) {
            // Cada venta tiene 2 URLs
            $sale->saleURLs()->saveMany(\App\Models\SaleURL::factory()->count(2)->make());

            // Cada venta tiene 2 traducciones, una en inglés y una en español
            $sale->saleTranslates()->saveMany(\App\Models\SaleTranslate::factory()->count(1)->make(['locale' => 'en']));
            $sale->saleTranslates()->saveMany(\App\Models\SaleTranslate::factory()->count(1)->make(['locale' => 'es']));
        });
    }
}
