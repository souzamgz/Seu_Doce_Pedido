<?php

namespace App\Models;
use App\Notifications\CustomVerifyEmail;  // Importe a notificação personalizada

use App\Notifications\ResetPasswordNotification;  // Importe a notificação personalizada

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'admin'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function sendEmailVerificationNotification()
{
    $this->notify(new CustomVerifyEmail());  // Use a sua notificação personalizada
}
public function sendPasswordResetNotification($token)
{
    $this->notify(new ResetPasswordNotification($token, $this->email));
}
public function informacoesPessoais()
{
    return $this->hasOne(InformacoesPessoais::class, 'user_id');
}
  public function enderecos()
    {
        return $this->hasMany(Endereco::class, 'user_id');
    }
    public function cupons()
{
    return $this->belongsToMany(Cupom::class, 'cupom_user')
                ->withPivot('usos')
                ->withTimestamps();
}

}
