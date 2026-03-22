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
        Schema::table('shop', function (Blueprint $table) {
            $table->string('rua')->nullable();
            $table->string('numero')->nullable();
            $table->string('bairro')->nullable();
            $table->string('cidade')->nullable();
            $table->string('estado')->nullable();
            $table->string('complemento')->nullable();
            $table->string('cep')->nullable();
            $table->string('documento')->nullable();
            $table->string('email')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shop', function (Blueprint $table) {
            // Remove as colunas que foram adicionadas no método up()
            $table->dropColumn([
                'rua',
                'numero',
                'bairro',
                'cidade',
                'estado',
                'complemento',
                'cep',
                'documento',
                'email'
            ]);
        });
    }
};