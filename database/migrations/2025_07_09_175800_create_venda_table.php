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
        Schema::create('vendas', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('id_mp')->nullable()->unique()->comment('ID do pagamento gerado pelo Mercado Pago');
            $table->unsignedBigInteger('id_user')->nullable();
            $table->string('status');
            $table->string('payment_url')->nullable();
            $table->decimal('valor', 10,2);
            $table->string('forma_pagamento')->nullable();
            $table->string('tipo');
            $table->string('nome');
            $table->string('email');
            $table->string('endereco')->nullable();
            $table->string('cep')->nullable();
            $table->string('rua')->nullable();
            $table->string('numero')->nullable();
            $table->string('telefone')->nullable();
            
             $table->foreign('id_user')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venda');
    }
};
