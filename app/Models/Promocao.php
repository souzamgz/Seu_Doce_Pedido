<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promocao extends Model
{
      use HasFactory;

    protected $table = 'promocao';

    protected $fillable = [
        'nome',
        'Id_Product',
        'imagem',
        'descricao',
        'price',
        'quantidade',
        'estoque',
        'ativo',
    ];

    // Relacionamento: promoção pertence a um produto
    public function product()
    {
        return $this->belongsTo(Product::class, 'Id_Product');
    }
}
