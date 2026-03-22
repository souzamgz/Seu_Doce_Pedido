<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VendaProduct extends Model
{
    use HasFactory;

    // Nome da tabela
    protected $table = 'venda_products';

    // Campos que podem ser preenchidos em massa
    protected $fillable = [
        'id_venda',
        'id_product',
        'id_category',
        'id_promocao',
        'nome',
        'preco',
        'descricao',
        'imagem',
        'categoria',
        'quantity',
        'kitquantity'
    ];

    // Relacionamento com Venda
    public function venda()
    {
        return $this->belongsTo(Venda::class, 'id_venda');
    }

    // Relacionamento com Product
    public function product()
    {
        return $this->belongsTo(Product::class, 'id_product');
    }

    // Relacionamento com Category
    public function category()
    {
        return $this->belongsTo(Category::class, 'id_category');
    }
}
