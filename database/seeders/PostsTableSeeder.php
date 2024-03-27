<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\PostTranslate;

class PostsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear 50 posts
        Post::factory()->count(6)->create()->each(function ($post) {
            // Para cada post, crear una traducción en inglés y una en español
            $post->translations()->saveMany(PostTranslate::factory()->count(1)->make(['locale' => 'en']));
            $post->translations()->saveMany(PostTranslate::factory()->count(1)->make(['locale' => 'es']));
        });
    }
}
