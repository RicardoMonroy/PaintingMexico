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
        Schema::create('sale_urls', function (Blueprint $table) {
            $table->id('idsaleURLs');
            $table->string('store', 255);
            $table->text('url');
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
        Schema::dropIfExists('sale_urls');
    }
};
