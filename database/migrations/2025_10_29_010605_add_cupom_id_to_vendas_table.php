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
             $table->unsignedBigInteger('cupom_id')->nullable()->after('id');
            $table->foreign('cupom_id')->references('id')->on('cupons')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendas', function (Blueprint $table) {
              // Primeiro remove a foreign key
            $table->dropForeign(['cupom_id']);
            // Depois remove a coluna
            $table->dropColumn('cupom_id');
        });
    }
};
