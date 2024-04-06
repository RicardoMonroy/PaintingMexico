<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Info;

class InfoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Info::create([
            'banner' => 'storage/banners/DefaultBanner.png', // Ejemplo de URL de banner
            'email' => 'contacto@paintingmexico.com',
        ]);
    }
}
