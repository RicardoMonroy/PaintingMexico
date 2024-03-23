<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Profile;
use App\Models\ProfileTranslate;

class ProfileTranslatesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profiles = Profile::all();

        foreach ($profiles as $profile) {
            ProfileTranslate::factory()->create([
                'profile_id' => $profile->id,
                'locale' => 'en',
                'description' => 'This is an English profile description.'
            ]);
            ProfileTranslate::factory()->create([
                'profile_id' => $profile->id,
                'locale' => 'es',
                'description' => 'Esta es una descripción de perfil en español.'
            ]);
        }
    }
}
