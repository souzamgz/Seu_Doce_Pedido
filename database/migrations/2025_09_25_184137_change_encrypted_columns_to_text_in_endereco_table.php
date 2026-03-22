<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    // 1. Primeiro, atualiza todos os registros existentes que são nulos para um valor padrão
    DB::table('enderecos')->whereNull('rua')->update(['rua' => 'Não informado']);
    DB::table('enderecos')->whereNull('numero')->update(['numero' => 'S/N']);
    DB::table('enderecos')->whereNull('bairro')->update(['bairro' => 'Não informado']);
    DB::table('enderecos')->whereNull('cidade')->update(['cidade' => 'Não informado']);
    DB::table('enderecos')->whereNull('estado')->update(['estado' => 'Não informado']);
    DB::table('enderecos')->whereNull('cep')->update(['cep' => '00000-000']);
    
    // 2. Agora que não há mais NULLs, podemos aplicar a regra com segurança
    Schema::table('enderecos', function (Blueprint $table) {
        $table->string('rua')->nullable(false)->change();
        $table->string('numero')->nullable(false)->change();
        $table->string('bairro')->nullable(false)->change();
        $table->string('cidade')->nullable(false)->change();
        $table->string('estado')->nullable(false)->change();
        $table->string('cep')->nullable(false)->change();
    });
    }
};