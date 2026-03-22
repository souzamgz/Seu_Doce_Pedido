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
            $table->string('instagram')->nullable();
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
                'instagram'
            ]);
        });
    }
};
