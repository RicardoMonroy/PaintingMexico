<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\PostsTableSeeder;
use Database\Seeders\ArtworksTableSeeder;
use Database\Seeders\ImagesTableSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        \App\Models\User::factory()->create([
            'name' => 'Ricardo Monroy',
            'email' => 'rmonroy.rodriguez@gmail.com',
            'email_verified_at' => now(),
            'password' => bcrypt('Morr3179*'), // password
            'remember_token' => \Illuminate\Support\Str::random(10),
            'role' => 'admin',
        ]);
        \App\Models\User::factory()->create([
            'name' => 'Jack Hannula',
            'email' => 'jackhannula@icloud.com',
            'email_verified_at' => now(),
            'password' => bcrypt('@Mesones38*'), // password
            'remember_token' => \Illuminate\Support\Str::random(10),
            'role' => 'admin',
        ]);

        // \App\Models\User::factory()->count(5)->create();

        $this->call([
            // PostsTableSeeder::class,
            // ArtworksTableSeeder::class,
            // ImagesTableSeeder::class,
            // VideosTableSeeder::class,
            // ProfilesTableSeeder::class,
            // ProfileTranslatesTableSeeder::class,
            // SalesTableSeeder::class,
            // SaleGalleriesTableSeeder::class,
            InfoTableSeeder::class,
        ]);

    }
}
