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
        Schema::create('cupons', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->string('descricao');
            $table->enum('tipo_desconto', ['percentual', 'valor'])->default('percentual');
            $table->decimal('valor_desconto', 10, 2);
            $table->decimal('valor_minimo', 10, 2)->nullable();
            $table->date('data_inicio');
            $table->date('data_fim')->nullable();
            $table->integer('limite_usos')->nullable();
            $table->integer('usos')->default(0);
            $table->boolean('apenas_primeira_compra')->default(false);
            $table->boolean('ativo')->default(true);
            $table->boolean('frete_gratis')->default(false);
            $table->unsignedBigInteger('produto_id')->nullable();
            $table->unsignedBigInteger('categoria_id')->nullable();
            $table->timestamps();

            $table->foreign('produto_id')->references('id')->on('product')->onDelete('cascade');
            $table->foreign('categoria_id')->references('id')->on('category')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cupons');
    }
};
