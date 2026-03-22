<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class PasswordServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Password::defaults(function () {
        return Password::min(8) // mínimo de 8 caracteres
            ->mixedCase()       // precisa ter maiúscula e minúscula
            ->letters()         // precisa ter letras
            ->numbers()         // precisa ter números
            ->uncompromised();  // não pode estar vazada em leaks (usa o haveibeenpwned)
    });
    }
}
