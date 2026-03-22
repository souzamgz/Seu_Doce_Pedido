<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Shop extends Model
{
    use HasFactory;

    protected $table = 'shop';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_banner',
        'hora_abertura',
        'hora_fechamento',
        'loja_aberta',

        // --- Campos de Contato e Endereço Adicionados ---
        'telefone',
        'email',
        'rua',
        'numero',
        'bairro',
        'cidade',
        'estado',
        'complemento',
        'cep',
        'instagram',

        // --- Dias de Funcionamento

        'funciona_domingo',
        'funciona_segunda',
        'funciona_terca',
        'funciona_quarta',
        'funciona_quinta',
        'funciona_sexta',
        'funciona_sabado'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'loja_aberta' => 'boolean', // Boa prática para campos booleanos
    ];

    /**
     * Relacionamento: A loja tem apenas um banner
     */
    public function banner()
    {
        return $this->belongsTo(Banner::class, 'id_banner', 'id');
    }
}