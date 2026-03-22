<?php

namespace App\Http\Controllers;

use App\Models\Promocao;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PromocaoController extends Controller
{
    // Listar todas promoções
    public function index()
    {
        $promocoes = Promocao::with('product')->get();

        return Inertia::render('Admin/Promocao/Promocoes', [
            'promocoes' => $promocoes
        ]);
    }

    // Formulário para criar promoção
    public function create()
    {
        $products = Product::all();

        return Inertia::render('Promocoes/Create', [
            'products' => $products
        ]);
    }

    // Salvar promoção no banco
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'nullable|string|max:255',
            'Id_Product' => 'nullable|exists:product,id',
            'descricao' => 'nullable|string|max:255',
            'price' => 'required|numeric',
            'quantidade' => 'nullable|integer',
            'estoque' => 'nullable|integer',
            'imagem' => 'nullable|image|max:2048',
        ]);
            $quantidade = $request->input('quantidade');
        if(!$request->input('quantidade')){
                $quantidade = 1;
        }

        
     
        $data = $request->only(
      'nome',
            'Id_Product', 
            'descricao', 
            'price', 
            'estoque');

        $data['quantidade'] = $quantidade;


      

         if ($request->hasFile('imagem')) {
        $arquivo = $request->file('imagem');
        $nomeArquivo = time() . '.' . $arquivo->getClientOriginalExtension();


        // Upload no Cloudflare R2 (disk 'r2_produtos' configurado)
        Storage::disk('r2_produtos')->put('imagens/' . $nomeArquivo, file_get_contents($arquivo));

        // URL pública
        $urlImagem = 'https://cdn.amorcomrecheio.shop/imagens/' . $nomeArquivo;
        $data['imagem'] = $urlImagem;

        // (Opcional) apagar imagem antiga — só se for local. 
        // Se for R2, precisaria de Storage::disk('r2_produtos')->delete(...)
}

        Product::where('id', $data['Id_Product'])->update(['ativo' => false]);

        Promocao::create($data);

        return redirect()->route('promocoes.index')->with('success', 'Promoção criada com sucesso!');
    }

    // Mostrar detalhes de uma promoção
    public function show($id)
    {
        $promocao = Promocao::with('product')->findOrFail($id);

        return Inertia::render('Promocoes/Show', [
            'promocao' => $promocao
        ]);
    }

    // Formulário para editar promoção
    public function edit($id)
    {
        $promocao = Promocao::findOrFail($id);
        $products = Product::all();

        return Inertia::render('Admin/Promocao/Edit', [
            'promocao' => $promocao,
            'products' => $products,
        ]);
    }

    // Atualizar promoção
    public function update(Request $request, $id)
    {
        $request->validate([
            'Id_Product' => 'nullable|exists:product,id',
            'descricao' => 'nullable|string|max:255',
            'price' => 'required|numeric',
            'quantidade' => 'nullable|integer',
            'estoque' => 'nullable|integer',
            'imagem' => 'nullable|image|max:2048',
            'ativo' => 'nullable|boolean',
        ]);

        

        $promocao = Promocao::findOrFail($id);

        $data = $request->only('Id_Product', 'descricao', 'price', 'quantidade', 'estoque', 'ativo');


         if ($request->hasFile('imagem')) {
        $arquivo = $request->file('imagem');
        $nomeArquivo = time() . '.' . $arquivo->getClientOriginalExtension();

    // Deleta imagem antiga no R2 se existir
    if ($promocao->imagem) {
        // Extrai o nome do arquivo antigo da URL
        $caminhoAntigo = str_replace('https://cdn.amorcomrecheio.shop/imagens/', '', $promocao->imagem);

        // Deleta do R2
        Storage::disk('r2_produtos')->delete('imagens/' . $caminhoAntigo);
    }

        // Upload no Cloudflare R2 (disk 'r2_produtos' configurado)
        Storage::disk('r2_produtos')->put('imagens/' . $nomeArquivo, file_get_contents($arquivo));

        // URL pública
        $urlImagem = 'https://cdn.amorcomrecheio.shop/imagens/' . $nomeArquivo;
        $data['imagem'] = $urlImagem;

        // (Opcional) apagar imagem antiga — só se for local. 
        // Se for R2, precisaria de Storage::disk('r2_produtos')->delete(...)
}

        $teste = null;
    if($request->ativo){
        Product::where('id', $data['Id_Product'])->update(['ativo' => false]);
      
    }
   

        $promocao->update($data);

        return redirect()->route('promocoes.index')->with('success', 'Promoção atualizada com sucesso!');
    }

    // Deletar promoção
    public function destroy($id)
    {
        $promocao = Promocao::findOrFail($id);
        $promocao->delete();

        return redirect()->route('promocoes.index')->with('success', 'Promoção excluída com sucesso!');
    }
}
