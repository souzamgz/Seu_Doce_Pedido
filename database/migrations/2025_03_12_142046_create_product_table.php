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
        Schema::create('product', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_categoria');
            $table->decimal('price');
            $table->string('name');
            $table->string('descricao');
            $table->string('imagem');
            $table->boolean('ativo')->default(true);
            $table->timestamps();

            $table->foreign('id_categoria')->references('id')->on('category')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product');
    }
};
