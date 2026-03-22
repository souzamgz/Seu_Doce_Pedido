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
        Schema::create('promocao', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('Id_Product')->nullable();
            $table->string('nome')->nullable();
            $table->string('imagem')->nullable();
            $table->string('descricao')->nullable();
            $table->decimal('price');
            $table->integer('quantidade')->nullable();
            $table->integer('estoque')->nullable();
            $table->boolean('ativo')->default(true);



            $table->foreign('Id_Product')->references('id')->on('product')->onDelete('cascade');
        });

        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promocao');
    }
};
