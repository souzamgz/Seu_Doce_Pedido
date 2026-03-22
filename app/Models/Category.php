<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // A tabela associada ao modelo (se não seguir a convenção 'categories', por exemplo)
    protected $table = 'category';

    // Defina os campos que podem ser preenchidos (Mass Assignment)
    protected $fillable = [
        'name',
        'imagem',
        'ativo'
    ];
}
