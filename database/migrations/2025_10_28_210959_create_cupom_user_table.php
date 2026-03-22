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
        Schema::create('cupom_user', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('cupom_id');
            $table->integer('usos')->default(0);
            $table->timestamps();
            
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('cupom_id')->references('id')->on('cupons')->onDelete('cascade');
            
            $table->unique(['user_id', 'cupom_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cupom_user');
    }
};
