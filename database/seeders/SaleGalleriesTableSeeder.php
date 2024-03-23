<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Sale;
use App\Models\SaleGallery;

class SaleGalleriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sales = Sale::all();

        foreach ($sales as $sale) {
            SaleGallery::factory()->count(4)->create([
                'sales_idsales' => $sale->idsales
            ]);
        }
    }
}
