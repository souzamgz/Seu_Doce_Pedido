<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory;

    // A tabela associada ao modelo (se não seguir a convenção 'Cart', por exemplo)
    protected $table = 'cart';

    // Defina os campos que podem ser preenchidos (Mass Assignment)
    protected $fillable = [
        'id_user',
        'subTotal',
    ];

      // Relacionamento com a tabela de usuários (caso aplicável)
      public function user()
      {
          return $this->belongsTo(User::class, 'idUser', 'id');
      }
}
