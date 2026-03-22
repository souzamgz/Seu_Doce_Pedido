<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $table = 'product'; // Nome da tabela no banco de dados

    protected $fillable = [
        'name',
        'price',
        'descricao',
        'ativo',
        'id_categoria',
        'imagem'
    ];

    /**
     * Relacionamento: Um produto pertence a uma categoria
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'id_categoria', 'id');
    }
}
