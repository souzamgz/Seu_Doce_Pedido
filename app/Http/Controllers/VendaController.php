<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Venda;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
class VendaController extends Controller
{
    
public function atualizarStatus(Request $request, $id)
{
    $venda = Venda::findOrFail($id);

    // Atualiza o status com base no que foi enviado na requisição
    $novoStatus = $request->input('status');

    // Segurança: apenas permite certos status válidos
    $statusPermitidos = ['iniciado', 'em_preparo', 'em_entrega', 'entregue', 'cancelado'];

    if (!in_array($novoStatus, $statusPermitidos)) {
        return redirect()->back()->with('failure', 'Atualizado Inválido');
    }

    // Atualiza e salva
    $venda->status = $novoStatus;
    $venda->save();

    return redirect()->back()->with('success', 'Atualizado Status');
}

public function cancelar($id)
{
    DB::table('vendas')->where('id', $id)->delete();
    DB::table('venda_products')->where('id_venda', $id)->delete();

     return redirect()->back()->with('success', 'Venda Descartada');
}
 public function definirPagamentoRetirada(Request $request, Venda $venda)
    {
        // 1. SEGURANÇA: Garante que o usuário só pode modificar seu próprio pedido.
        if (Auth::id() !== $venda->id_user) {
            abort(403, 'Ação não autorizada.');
        }

        // 2. VALIDAÇÃO: Verifica se os dados recebidos são válidos.
        $validated = $request->validate([
            'forma_pagamento' => [
                'required', 
                'string', 
                Rule::in(['dinheiro', 'cartao', 'pix'])
            ],
            // 'gte' significa "maior ou igual a". O valor para troco não pode ser menor que o total.
            'valor_troco_para' => ['nullable', 'numeric', 'gte:' . $venda->valor],
        ]);
        
        // 3. ATUALIZAÇÃO: Modifica os dados da venda no banco.
        $venda->status = 'pagamento_na_retirada'; // Novo status
        $venda->forma_pagamento = $validated['forma_pagamento'];
        $venda->valor_troco_para = $validated['valor_troco_para'] ?? null;
        
        $venda->save();

        // 4. RESPOSTA: O Inertia já lida com o redirecionamento a partir do onSuccess do seu frontend.
        //    Apenas retornamos um redirecionamento para garantir.
        return Redirect::route('dashboard');

    }
}

