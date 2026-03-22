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
        Schema::create('enderecos', function (Blueprint $table) {
            $table->id();
            // Sintaxe moderna e correta para a chave estrangeira
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // A ordem é definida pela sequência, sem usar ->after()
            $table->string('nome_perfil')->default('Principal');
            $table->boolean('is_principal')->default(false);
            
            // Campos de endereço obrigatórios (sem nullable)
            $table->string('cep')->nullable();
            $table->string('rua')->nullable();
            $table->string('numero')->nullable();
            $table->string('bairro')->nullable();
            $table->string('cidade')->nullable();
            $table->string('estado')->nullable();

            // Complemento pode ser opcional
            $table->string('complemento')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enderecos');
    }
};