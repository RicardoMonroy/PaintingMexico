<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('artwork_section', function (Blueprint $table) {
            $table->unsignedBigInteger('artwork_id');
            $table->unsignedBigInteger('section_id');
            $table->timestamps();

            $table->primary(['artwork_id', 'section_id']);

            $table->foreign('artwork_id')->references('id')->on('artworks')->onDelete('cascade');
            $table->foreign('section_id')->references('id')->on('sections')->onDelete('cascade');
        });

        // Transferir datos existentes de 'section_id' a la tabla pivote
        $artworks = DB::table('artworks')->whereNotNull('section_id')->get();

        foreach ($artworks as $artwork) {
            DB::table('artwork_section')->insert([
                'artwork_id' => $artwork->id,
                'section_id' => $artwork->section_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Eliminar la columna 'section_id' de 'artworks'
        Schema::table('artworks', function (Blueprint $table) {
            $table->dropForeign(['section_id']);
            $table->dropColumn('section_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restaurar la columna 'section_id' en 'artworks'
        Schema::table('artworks', function (Blueprint $table) {
            $table->unsignedBigInteger('section_id')->nullable();

            $table->foreign('section_id')->references('id')->on('sections');
        });

        // Opcional: Puedes volver a asignar las secciones desde la tabla pivote si lo deseas

        Schema::dropIfExists('artwork_section');
    }
};
