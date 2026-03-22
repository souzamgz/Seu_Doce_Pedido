<?php

namespace App\Http\Controllers;

use App\Models\Cupom;
use App\Models\CupomUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CupomController extends Controller
{
    /**
     * Exibe todos os cupons.
     */
    public function index()
    {
        $cupons = Cupom::latest()->paginate(10);
        return response()->json($cupons);
    }

    /**
     * Cria um novo cupom.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'required|string|unique:cupons,codigo',
            'descricao' => 'required|string|max:255',
            'tipo_desconto' => 'required|in:percentual,valor',
            'valor_desconto' => 'required|numeric|min:0',
            'valor_minimo' => 'nullable|numeric|min:0',
            'data_inicio' => 'required|date',
            'data_fim' => 'nullable|date|after_or_equal:data_inicio',
            'limite_usos' => 'nullable|integer|min:1',
            'apenas_primeira_compra' => 'boolean',
            'ativo' => 'boolean',
            'frete_gratis' => 'boolean',
            'produto_id' => 'nullable|exists:product,id',
            'categoria_id' => 'nullable|exists:category,id',
        ]);

        $cupom = Cupom::create($validated);

      return redirect()->route('Cupom');
    }

    /**
     * Exibe um cupom específico.
     */
    public function show($id)
    {
        $cupom = Cupom::findOrFail($id);
        return redirect()->route('Cupom');
    }

    /**
     * Atualiza um cupom existente.
     */
    public function update(Request $request, $id)
    {
        $cupom = Cupom::findOrFail($id);

        $validated = $request->validate([
            'codigo' => 'sometimes|string|unique:cupons,codigo,' . $id,
            'descricao' => 'sometimes|string|max:255',
            'tipo_desconto' => 'sometimes|in:percentual,valor',
            'valor_desconto' => 'sometimes|numeric|min:0',
            'valor_minimo' => 'nullable|numeric|min:0',
            'data_inicio' => 'sometimes|date',
            'data_fim' => 'nullable|date|after_or_equal:data_inicio',
            'limite_usos' => 'nullable|integer|min:1',
            'apenas_primeira_compra' => 'boolean',
            'ativo' => 'boolean',
            'frete_gratis' => 'boolean',
            'produto_id' => 'nullable|exists:product,id',
            'categoria_id' => 'nullable|exists:category,id',
        ]);

        $cupom->update($validated);

       return redirect()->route('Cupom');
    }

    /**
     * Remove um cupom.
     */
    public function destroy($id)
    {
        $cupom = Cupom::findOrFail($id);
        $cupom->delete();

        return redirect()->route('Cupom');
    }
        public function aplicarCupom(Request $request)
    {
        $request->validate([
            'codigo' => 'required|string',
        ]);

        // Procura o cupom pelo código
        $cupom = Cupom::where('codigo', $request->codigo)->first();

        if (!$cupom) {
            return back()->withErrors(['codigo' => 'Cupom inválido']);
        }

        $user = Auth::user();

        // Verifica se já existe a relação
        $cupomUser = CupomUser::firstOrCreate(
            [
                'user_id' => $user->id,
                'cupom_id' => $cupom->id,
            ],
            ['usos' => 0] // caso seja criado agora
        );

        return back()->with('success', 'Cupom aplicado com sucesso!');
    }
    public function meusCupons()
{
    $user = Auth::user();

    // Pega todos os cupons vinculados ao usuário
    $cupons = $user->cupons()->get(); // assume que você tem o relacionamento no User

    return Inertia::render('Cupom/MeusCupons', [
        'cupons' => $cupons
    ]);
}
}
