<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Cupom extends Model
{
    use HasFactory;

    protected $table = 'cupons';

    protected $fillable = [
        'codigo',
        'descricao',
        'tipo_desconto',
        'valor_desconto',
        'valor_minimo',
        'data_inicio',
        'data_fim',
        'limite_usos',
        'usos',
        'apenas_primeira_compra',
        'ativo',
        'frete_gratis',
        'produto_id',
        'categoria_id',
    ];

    protected $casts = [
        'apenas_primeira_compra' => 'boolean',
        'ativo' => 'boolean',
        'frete_gratis' => 'boolean',
        'data_inicio' => 'date',
        'data_fim' => 'date',
        'valor_desconto' => 'decimal:2',
        'valor_minimo' => 'decimal:2',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELACIONAMENTOS
    |--------------------------------------------------------------------------
    */

    // Usuários que usaram o cupom
    public function users()
    {
        return $this->belongsToMany(User::class, 'cupom_user')
                    ->withPivot('usos')
                    ->withTimestamps();
    }

    // Produto associado (opcional)
    public function produto()
    {
        return $this->belongsTo(Product::class, 'produto_id');
    }

    // Categoria associada (opcional)
    public function categoria()
    {
        return $this->belongsTo(Category::class, 'categoria_id');
    }

    /*
    |--------------------------------------------------------------------------
    | MÉTODOS ÚTEIS
    |--------------------------------------------------------------------------
    */

    // Verifica se o cupom ainda é válido
    public function isValido()
    {
        $agora = Carbon::now();

        if (!$this->ativo) return false;
        if ($this->data_inicio && $agora->lt($this->data_inicio)) return false;
        if ($this->data_fim && $agora->gt($this->data_fim)) return false;
        if ($this->limite_usos && $this->usos >= $this->limite_usos) return false;

        return true;
    }

    // Calcula o desconto aplicado a um valor
    public function calcularDesconto($valor)
    {
        if ($this->tipo_desconto === 'percentual') {
            return round($valor * ($this->valor_desconto / 100), 2);
        }

        return min($this->valor_desconto, $valor);
    }
    // Dentro do model Cupom.php
public function atingiuLimitePorUsuario($userId)
{
    $cupomUser = \App\Models\CupomUser::where('user_id', $userId)
        ->where('cupom_id', $this->id)
        ->first();

    if (!$cupomUser) return false;

    // Se o número de usos do usuário >= limite de usos do cupom
    return $this->limite_usos && $cupomUser->usos >= $this->limite_usos;
}

}
