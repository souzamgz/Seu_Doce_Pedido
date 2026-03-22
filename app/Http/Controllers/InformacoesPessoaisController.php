<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InformacoesPessoais;
use App\Models\Endereco;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
class InformacoesPessoaisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    // Validação dos dados recebidos
    $validatedData = $request->validate([
        'rua' => 'nullable|string|max:255',
        'numero' => 'nullable|integer',
        'bairro' => 'nullable|string|max:255',
        'cidade' => 'nullable|string|max:255',
        'estado' => 'nullable|string|max:255',
        'cep' => 'nullable|string|max:20',
        'telefone' => 'nullable|string|max:20',
        'cpf' => 'nullable|string|max:14',
        'complemento' => 'nullable|string|max:255',
    ]);

    // Adiciona o ID do usuário logado para vincular o registro
    $validatedData['user_id'] = auth()->id();

    // Cria o novo registro
    InformacoesPessoais::create($validatedData);

    // Redireciona de volta com mensagem de sucesso
    return redirect()->back()->with('success', 'Informações pessoais cadastradas com sucesso!');
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
public function storeOrUpdate(Request $request)
{
    $user = auth()->user();

    // Validação
    $validated = $request->validate([
        'telefone' => ['nullable', 'string', 'max:20'],
        'cpf'      => ['nullable', 'string', 'max:14'],
        'enderecos' => ['nullable', 'array', 'min:1'],
        'enderecos.*.id' => ['nullable', 'integer'],
        'enderecos.*.nome_perfil' => ['nullable', 'string', 'max:255'],
        'enderecos.*.rua' => ['nullable', 'string', 'max:255'],
        'enderecos.*.numero' => ['nullable', 'string', 'max:20'],
        'enderecos.*.bairro' => ['nullable', 'string', 'max:255'],
        'enderecos.*.cidade' => ['nullable', 'string', 'max:255'],
        'enderecos.*.estado' => ['nullable', 'string', 'max:255'],
        'enderecos.*.cep' => ['nullable', 'string', 'max:9'],
        'enderecos.*.complemento' => ['nullable', 'string', 'max:255'],
        'enderecos.*.is_principal' => ['nullable', 'boolean'],
    ]);

    // Salva ou atualiza informações pessoais
    InformacoesPessoais::updateOrCreate(
        ['user_id' => $user->id],
        [
            'telefone' => $validated['telefone'] ?? null,
            'cpf' => $validated['cpf'] ?? null,
        ]
    );

    // Itera por todos os endereços enviados
    if (!empty($validated['enderecos'])) {
        foreach ($validated['enderecos'] as $endereco) {
            $endereco['user_id'] = $user->id;

            // Se o endereço tem ID, atualiza pelo ID; senão cria novo
            Endereco::updateOrCreate(
                ['id' => $endereco['id'] ?? null],
                $endereco
            );
        }

        // Garante que apenas 1 endereço principal exista
        $enderecosPrincipal = collect($validated['enderecos'])->filter(fn($e) => $e['is_principal'] ?? false);
        if ($enderecosPrincipal->count() > 1) {
            // Se tiver mais de 1 principal, mantém apenas o primeiro
            $primeiroPrincipalId = $enderecosPrincipal->first()['id'] ?? null;
            Endereco::where('user_id', $user->id)
                ->where('id', '<>', $primeiroPrincipalId)
                ->update(['is_principal' => false]);
        }
    }
    
        return redirect()->back()->with('success', 'Informações salvas com sucesso!');
}




    /**
     * Remove the specified resource from storage.
     */
   public function destroy($id)
{
    $user = auth()->user();

    // Busca o endereço do usuário pelo ID
    $endereco = $user->enderecos()->where('id', $id)->first();

    if (!$endereco) {
        return redirect()->back()->with('error', 'Endereço não encontrado.');
    }

    // Evita remover o endereço principal se tiver apenas ele
    if ($endereco->is_principal && $user->enderecos()->count() === 1) {
        return redirect()->back()->with('error', 'Não é possível remover o único endereço principal.');
    }

    $endereco->delete();

    return redirect()->back()->with('success', 'Endereço removido com sucesso!');
}

}
