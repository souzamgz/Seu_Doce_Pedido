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
            // Adiciona uma coluna booleana para cada dia da semana
            $table->boolean('funciona_domingo')->default(true);
            $table->boolean('funciona_segunda')->default(true);
            $table->boolean('funciona_terca')->default(true);
            $table->boolean('funciona_quarta')->default(true);
            $table->boolean('funciona_quinta')->default(true);
            $table->boolean('funciona_sexta')->default(true);
            $table->boolean('funciona_sabado')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shop', function (Blueprint $table) {
             $table->dropColumn([
                'funciona_domingo',
                'funciona_segunda',
                'funciona_terca',
                'funciona_quarta',
                'funciona_quinta',
                'funciona_sexta',
                'funciona_sabado',
            ]);
        });
    }
};
