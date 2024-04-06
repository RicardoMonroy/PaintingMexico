<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\PostTranslate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $locale = $request->get('lang', 'en'); // Obtén el parámetro 'lang' o utiliza 'en' como predeterminado.
        $posts = Post::with(['translations' => function ($query) use ($locale) {
            $query->where('locale', $locale);
        }, 'user'])->orderByDesc('created_at')->get();

        return response()->json($posts);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'cover' => 'required|image',
            'translations' => 'required|string',
        ]);

        try {
            $post = new Post();
            $post->user_id = auth()->id();

            if ($request->hasFile('cover')) {
                $coverPath = $request->file('cover')->store('posts', 'public');
                $post->cover = Storage::url($coverPath);
            }

            $post->save();
    
            $translations = json_decode($request->get('translations'), true);

            foreach ($translations as $locale => $translationData) {
                $post->translations()->create([
                    'locale' => $locale,
                    'title' => $translationData['title'],
                    'content' => $translationData['content']
                ]);
            }
    
            return response()->json($post);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error saving post'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $post = Post::with(['translations'])->find($id);
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }
        return response()->json($post);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $validatedData = $request->validate([
            'cover' => 'sometimes|image',
            'translations.*.title' => 'required|string',
            'translations.*.content' => 'required|string',
        ]);

        if ($request->hasFile('cover')) {
            $coverImagePath = $request->file('cover')->store('public/posts');
            $post->cover = Storage::url($coverImagePath);
        }

        $translations = $request->input('translations');
        foreach ($translations as $locale => $data) {
            $translation = $post->translations()->where('locale', $locale)->first();
            if ($translation) {
                $translation->update($data);
            }
        }

        $post->save();

        return response()->json($post);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->translations()->delete();
        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }
}
