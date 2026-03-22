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
            // Seu método up() está correto.
            $table->decimal('valor_troco_para', 10, 2)->nullable()->after('valor');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendas', function (Blueprint $table) {
            $table->dropColumn('valor_troco_para');
        });
    }
};
