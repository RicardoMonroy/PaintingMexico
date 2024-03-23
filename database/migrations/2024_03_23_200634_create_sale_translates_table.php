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
        Schema::create('sale_translates', function (Blueprint $table) {
            $table->id('idsaleTranslates');
            $table->string('locale', 45);
            $table->string('title', 100);
            $table->text('description');
            $table->unsignedBigInteger('sales_idsales');
            $table->timestamps();

            $table->foreign('sales_idsales')->references('idsales')->on('sales')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_translates');
    }
};
