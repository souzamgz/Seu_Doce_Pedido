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
            // Adiciona o método ->change() ao final de cada linha
            $table->text('nome')->change();
            $table->text('email')->change();
            $table->text('endereco')->nullable()->change();
            $table->text('cep')->nullable()->change();
            $table->text('rua')->nullable()->change();
            $table->text('numero')->nullable()->change();
            $table->text('bairro')->nullable()->change();
            $table->text('cidade')->nullable()->change();
            $table->text('estado')->nullable()->change();
            $table->text('telefone')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendas', function (Blueprint $table) {
            // Seu método down() já está correto
            $table->string('nome', 255)->change();
            $table->string('email', 255)->change();
            $table->string('endereco', 255)->nullable()->change();
            $table->string('cep', 255)->nullable()->change();
            $table->string('rua', 255)->nullable()->change();
            $table->string('numero', 255)->nullable()->change();
            $table->string('bairro', 255)->nullable()->change();
            $table->string('cidade', 255)->nullable()->change();
            $table->string('estado', 255)->nullable()->change();
            $table->string('telefone', 255)->nullable()->change();
        });
    }
};