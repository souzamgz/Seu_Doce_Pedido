<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CupomUser extends Model
{
    use HasFactory;

    protected $table = 'cupom_user';

    protected $fillable = [
        'user_id',
        'cupom_id',
        'usos',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELACIONAMENTOS
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cupom()
    {
        return $this->belongsTo(Cupom::class);
    }

    /*
    |--------------------------------------------------------------------------
    | MÉTODOS ÚTEIS
    |--------------------------------------------------------------------------
    */

    // Incrementa o número de usos
    public function incrementarUso()
    {
        $this->usos += 1;
        $this->save();
    }
     public function DesincrementarUso()
    {
        $this->usos -= 1;
        $this->save();
    }

    // Verifica se o usuário já atingiu o limite (1 uso, por exemplo)
    public function atingiuLimite($limite = 1)
    {
        return $this->usos >= $limite;
    }
}
