<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Venda extends Model
{
    use HasFactory;

    protected $table = 'vendas';

    protected $fillable = [
        'id_user',
        'status',
        'id_mp',
        'payment_url',
        'forma_pagamento',
        'cupom_id',
        'valor',
        'tipo',
        'nome',
        'email',
        'endereco',
        'cep',
        'rua',
        'numero',
        'telefone',
        'bairro',
        'cidade',
        'estado',
        'endereco_id', // se usar o relacionamento enderecoVenda
    ];

    // ---------------------
    // RELACIONAMENTOS
    // ---------------------
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function produtos()
    {
        return $this->hasMany(VendaProduct::class, 'id_venda');
    }

    public function enderecoVenda()
    {
        return $this->belongsTo(Endereco::class, 'endereco_id');
    }

     public function cupomId()
    {
        return $this->belongsTo(Cupom::class, 'cupom_id');
    }

    // ---------------------
    // FUNÇÃO AUXILIAR DE DESCRIPTOGRAFIA SEGURA
    // ---------------------
    protected function decryptSafe($value)
    {
        if (!$value) return null;

        try {
            return Crypt::decryptString($value);
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            return $value; // retorna o valor original se não estiver criptografado
        }
    }

    // ---------------------
    // ACCESSORS / MUTATORS
    // ---------------------
    protected function nome(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $this->decryptSafe($value),
            set: fn($value) => $value ? Crypt::encryptString($value) : null
        );
    }

    protected function email(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $this->decryptSafe($value),
            set: fn($value) => $value ? Crypt::encryptString($value) : null
        );
    }

    protected function endereco(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $this->decryptSafe($value),
            set: fn($value) => $value ? Crypt::encryptString($value) : null
        );
    }

    protected function rua(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $this->decryptSafe($value),
            set: fn($value) => $value ? Crypt::encryptString($value) : null
        );
    }

    protected function numero(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $this->decryptSafe($value),
            set: fn($value) => $value ? Crypt::encryptString($value) : null
        );
    }

    protected function cep(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $this->decryptSafe($value),
            set: fn($value) => $value ? Crypt::encryptString($value) : null
        );
    }

    protected function telefone(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $this->decryptSafe($value),
            set: fn($value) => $value ? Crypt::encryptString($value) : null
        );
    }

    protected function bairro(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $this->decryptSafe($value),
            set: fn($value) => $value ? Crypt::encryptString($value) : null
        );
    }

    protected function cidade(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $this->decryptSafe($value),
            set: fn($value) => $value ? Crypt::encryptString($value) : null
        );
    }

    protected function estado(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $this->decryptSafe($value),
            set: fn($value) => $value ? Crypt::encryptString($value) : null
        );
    }
}
