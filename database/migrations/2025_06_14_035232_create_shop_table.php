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
        Schema::create('shop', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_banner');
            $table->timestamps();

            $table->string('telefone');

            $table->time('hora_abertura')->nullable();
            $table->time('hora_fechamento')->nullable();

            $table->boolean('loja_aberta')->default(false);

            $table->foreign('id_banner')->references('id')->on('banner')->onDelete('cascade');
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop');
    }
};
