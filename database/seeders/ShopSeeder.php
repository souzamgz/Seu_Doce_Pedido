<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shop;
use App\Models\Banner;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        // Primeiro cria ou encontra um banner
        $banner = Banner::firstOrCreate(
            ['nome' => 'Banner Principal'], 
            ['imagem' => 'banner.jpg']   
        );

        // Cria a loja com o id do banner
        Shop::updateOrCreate(
            ['id' => 1], // força o ID 1
            [
                'telefone' => "00000-0000",
                 'id_banner' => $banner->id,
                'hora_abertura' => '08:00:00',
                'hora_fechamento' => '18:00:00',
                'loja_aberta' => true,
            ]
        );
    }
}
