<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Registre os comandos customizados.
     */
    protected $commands = [
        \App\Console\Commands\VerificarLojaAberta::class,
    ];

    /**
     * Defina as tarefas agendadas.
     */
    protected function schedule(Schedule $schedule): void
    {

        $schedule->command('app:verificar-loja-aberta')->everyMinute();
    }

    /**
     * Registre os comandos para o Artisan.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
