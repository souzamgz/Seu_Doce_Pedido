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
        Schema::create('cart_product', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('Id_Cart');
            $table->unsignedBigInteger('Id_Product')->nullable();
            $table->decimal('preco')->nullable();
            $table->boolean('promo')->default(false);
            $table->unsignedBigInteger('Id_Promo')->nullable();
            $table->integer('quantity');


            $table->foreign('Id_Cart')->references('id')->on('cart')->onDelete('cascade');
            $table->foreign('Id_Product')->references('id')->on('product')->onDelete('cascade');
            $table->foreign('Id_Promo')->references('id')->on('promocao')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_product');
    }
};
