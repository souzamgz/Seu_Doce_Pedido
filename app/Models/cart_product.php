<?php

namespace App\Models;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Database\Eloquent\Model;

class cart_product extends Model
{   
    protected $table = "cart_product";

    protected $fillable = [
        'Id_Cart',
        'Id_Product',
        'quantity',
        'promo',
        'price',
        'Id_Promo'
    ];

     // Relacionamento com a tabela de usuários (caso aplicável)
     public function cart()
     {
         return $this->belongsTo(Cart::class, 'Id_Cart', 'id');
     }
     public function product()
     {
         return $this->belongsTo(Product::class, 'Id_Product', 'id');
     }
}
