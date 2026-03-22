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
        Schema::create('venda_products', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('id_venda');
            $table->unsignedBigInteger('id_product')->nullable();
            $table->unsignedBigInteger('id_category')->nullable();
             $table->unsignedBigInteger('id_promocao')->nullable();
            $table->string('nome');
            $table->decimal('preco', 10,2);
            $table->string('descricao');
            $table->string('imagem');
            $table->string('categoria');
            $table->integer('quantity');
            $table->integer('kitquantity')->nullable();
            $table->foreign('id_product')->references('id')->on('product')->onDelete('cascade');
            $table->foreign('id_venda')->references('id')->on('vendas')->onDelete('cascade');
            $table->foreign('id_category')->references('id')->on('category')->onDelete('cascade');
            $table->foreign('id_promocao')->references('id')->on('promocao')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venda_product');
    }
};
