<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
   use HasFactory;

    // A tabela associada ao modelo (se não seguir a convenção 'banner', por exemplo)
    protected $table = 'banner';

    // Defina os campos que podem ser preenchidos (Mass Assignment)
    protected $fillable = [
        'nome',
        'imagem'
    ];
}
