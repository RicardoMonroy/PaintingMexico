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
            'banner' => 'https://via.placeholder.com/1200x300.png/009900?text=PaintingMexico+Banner', // Ejemplo de URL de banner
            'email' => 'contacto@paintingmexico.com',
        ]);
    }
}
