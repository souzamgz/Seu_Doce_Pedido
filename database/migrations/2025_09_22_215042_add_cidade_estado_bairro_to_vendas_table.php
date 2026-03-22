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
        Schema::table('vendas', function (Blueprint $table) {
            // Adiciona as novas colunas
            $table->string('bairro')->nullable();
            $table->string('cidade')->nullable();
            $table->string('estado')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendas', function (Blueprint $table) {
            // Remove as colunas caso a migration seja revertida
            $table->dropColumn(['bairro', 'cidade', 'estado']);
        });
    }
};