<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('artwork_translates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('artwork_id');
            $table->string('locale', 45);
            $table->string('title', 100);
            $table->text('description');
            $table->timestamps();

            $table->foreign('artwork_id')->references('id')->on('artworks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artwork_translates');
    }
};
