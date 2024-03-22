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

        // \App\Models\User::factory()->create([
        //     'name' => 'admin',
        //     'email' => 'admin@paintingmexico.com',
        //     'email_verified_at' => now(),
        //     'password' => bcrypt('secret'), // password
        //     'remember_token' => Str::random(10),
        //     'role' => 'admin',
        // ]);

        \App\Models\User::factory()->count(5)->create();

        $this->call([
            \Database\Seeders\PostsTableSeeder::class,
            \Database\Seeders\ArtworksTableSeeder::class,
            \Database\Seeders\ImagesTableSeeder::class,
            // Cualquier otro seeder que tengas...
        ]);

    }
}
