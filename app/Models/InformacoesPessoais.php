<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Database\Eloquent\Casts\Attribute;

class InformacoesPessoais extends Model
{
    use HasFactory;

    protected $table = "informacoes_pessoais";

    protected $fillable = [
        'user_id',
        'telefone',
        'cpf',
    ];

    /**
     * Accessor/Mutator para telefone
     */
    protected function telefone(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? Crypt::decryptString($value) : null,
            set: fn($value) => $value ? Crypt::encryptString($value) : null,
        );
    }

    /**
     * Accessor/Mutator para cpf
     */
    protected function cpf(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? Crypt::decryptString($value) : null,
            set: fn($value) => $value ? Crypt::encryptString($value) : null,
        );
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
