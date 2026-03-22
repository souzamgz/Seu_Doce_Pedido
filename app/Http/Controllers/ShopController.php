<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;
use Illuminate\Support\Facades\Redirect;

class ShopController extends Controller
{
     /**
     * Retorna todos os banners e o banner atual da loja.
     */
    public function index()
    {
        $banners = Banner::all(); // pega todos os banners
        $shop = Shop::find(1); // assume que só tem uma loja, com id 1

        return response()->json([
            'banners' => $banners,
            'selected_banner_id' => $shop?->id_banner, // null-safe caso shop não exista
        ]);
    }

    /**
     * Atualiza o banner da loja com o ID 1.
     */
  public function update(Request $request)
    {

        // 1. ATUALIZE A VALIDAÇÃO
        // Adicionando as regras para os novos campos de endereço e e-mail.
        $validatedData = $request->validate([
            'id_banner'       => 'nullable|exists:banner,id',
            'hora_abertura'   => 'nullable|date_format:H:i',
            'hora_fechamento' => 'nullable|date_format:H:i',
            'loja_aberta'     => 'nullable|boolean',
            'telefone'        => 'nullable|string|max:20',
            // --- Novos campos validados ---
            'email'           => 'nullable|email|max:255',
            'cep'             => 'nullable|string|max:9',
            'rua'             => 'nullable|string|max:255',
            'numero'          => 'nullable|string|max:20',
            'bairro'          => 'nullable|string|max:255',
            'cidade'          => 'nullable|string|max:255',
            'estado'          => 'nullable|string|max:255', // Ajuste o max se usar a sigla (ex: max:2)
            'complemento'     => 'nullable|string|max:255',
            'instagram'       => 'nullable|string|max:255',


            // -- Dias da semana funcionamento

            'funciona_domingo' => 'nullable|boolean',
            'funciona_segunda' => 'nullable|boolean',
            'funciona_terca' => 'nullable|boolean',
            'funciona_quarta' => 'nullable|boolean',
            'funciona_quinta' => 'nullable|boolean',
            'funciona_sexta' => 'nullable|boolean',
            'funciona_sabado' => 'nullable|boolean'
        ]);

        // Busca ou cria o registro da loja (seu código está correto)
        $shop = Shop::firstOrCreate(['id' => 1]);

        // 2. ATUALIZE OS CAMPOS (usando o array validado)
        // O método `update` é uma forma mais limpa e segura de fazer isso.
        // Ele só vai tentar preencher os campos que foram validados.
        $shop->update($validatedData);

        // Resposta para o Inertia
        return Redirect::back()->with('success', 'Loja atualizada com sucesso!');
    }



}
