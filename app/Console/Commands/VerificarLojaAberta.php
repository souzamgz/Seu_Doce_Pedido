<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Shop;
use Carbon\Carbon;


class VerificarLojaAberta extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:verificar-loja-aberta';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
 public function handle()
    {
        $shop = Shop::first();

        if (!$shop) {
            $this->error('Configurações da loja não encontradas.');
            return;
        }

        // --- INÍCIO DA VERIFICAÇÃO DO DIA DA SEMANA ---

        // 1. Mapeia os dias da semana (0=Domingo, 1=Segunda...) para as colunas do banco.
        $diasDaSemanaMap = [
            0 => 'funciona_domingo',
            1 => 'funciona_segunda',
            2 => 'funciona_terca',
            3 => 'funciona_quarta',
            4 => 'funciona_quinta',
            5 => 'funciona_sexta',
            6 => 'funciona_sabado',
        ];

        $agora = Carbon::now();
        
        // 2. Pega o dia da semana atual (como um número) e descobre a coluna correspondente.
        $diaAtual = $agora->dayOfWeek;
        $colunaDoDia = $diasDaSemanaMap[$diaAtual]; // Ex: 'funciona_sabado'

        // 3. Verifica se a loja deve funcionar hoje (retorna true ou false).
        $hojeFunciona = $shop->$colunaDoDia;

        $statusDesejado = false; // Começamos assumindo que a loja está fechada.

        // 4. Se a loja funciona hoje, AÍ SIM verificamos o horário.
        if ($hojeFunciona && $shop->hora_abertura && $shop->hora_fechamento) {
            
            // Pega hoje com hora da abertura e fechamento
            $abertura = Carbon::createFromFormat('H:i:s', $shop->hora_abertura)->setDate($agora->year, $agora->month, $agora->day);
            $fechamento = Carbon::createFromFormat('H:i:s', $shop->hora_fechamento)->setDate($agora->year, $agora->month, $agora->day);

            // Se a hora de fechamento for menor que a abertura, quer dizer que atravessa a meia-noite
            if ($fechamento->lessThanOrEqualTo($abertura)) {
                $fechamento->addDay();
                if ($agora->lessThan($abertura)) {
                    $agora->addDay();
                }
            }

            // O status desejado só será 'true' se estivermos no horário de funcionamento
            $statusDesejado = $agora->between($abertura, $fechamento);

            // Logs para depuração
            $this->info("--- Verificação de Horário ---");
            $this->info("Abertura:   {$abertura->format('Y-m-d H:i:s')}");
            $this->info("Fechamento: {$fechamento->format('Y-m-d H:i:s')}");
            $this->info("Agora:      {$agora->format('Y-m-d H:i:s')}");

        }
        // Se $hojeFunciona for false, o código acima é pulado e $statusDesejado continua como 'false'.

        // --- FIM DA VERIFICAÇÃO ---

        $this->info("\n--- Resumo ---");
        $this->info("Dia da semana: " . $agora->dayName . " ({$colunaDoDia})");
        $this->info("Configurado para funcionar hoje? " . ($hojeFunciona ? 'Sim' : 'Não'));
        $this->info("Status atual no banco: " . ($shop->loja_aberta ? 'Aberta' : 'Fechada'));
        $this->info("Status desejado agora: " . ($statusDesejado ? 'Aberta' : 'Fechada'));

        // Lógica final para salvar, só altera se for necessário
        if ($shop->loja_aberta !== $statusDesejado) {
            $shop->loja_aberta = $statusDesejado;
            $shop->save();
            $this->info("=> Status da loja ATUALIZADO para: " . ($statusDesejado ? 'Aberta' : 'Fechada'));
        } else {
            $this->info("=> Status da loja já está correto. Nenhuma alteração necessária.");
        }
    }
}
