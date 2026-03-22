<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Promocao;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all(); // Busca todas as categorias
        return Inertia::render('ProductCreate', [
            'categories' => $categories // Passa as categorias para o componente
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */


public function store(Request $request): RedirectResponse
{
    // Requisição e validação das informações
    $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'id_categoria' => 'required|integer',
        'descricao' => 'required|string|max:255',
        'imagem' => 'required|image|mimes:jpeg,png,jpg|max:2024'
    ]);

    $urlImagem = null;

    // Upload da imagem para Cloudflare R2
    if ($request->hasFile('imagem')) {
        $arquivo = $request->file('imagem');
        $nomeArquivo = time() . '.' . $arquivo->getClientOriginalExtension();

        // Salvar no bucket 'r2' (definido no filesystems.php)
        Storage::disk('r2_produtos')->put('imagens/' . $nomeArquivo, file_get_contents($arquivo));

        // Montar URL pública para salvar no banco
        $urlImagem = 'https://cdn.amorcomrecheio.shop/imagens/' . $nomeArquivo;
    }

    // Criar o produto com a URL completa da imagem
    Product::create([
        'name' => $request->name,
        'price' => $request->price,
        'id_categoria' => $request->id_categoria,
        'descricao' => $request->descricao,
        'imagem' => $urlImagem,  // Salva URL completa aqui
    ]);

    return redirect()->route('Produtos');
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);
        return Inertia::render('Admin/Product/Show', [
            'product' => $product
        ]);
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
public function update(Request $request, $id): RedirectResponse
{
    $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'id_categoria' => 'required|integer',
        'descricao' => 'nullable|string',
        'imagem' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        'ativo' => 'nullable|boolean',
    ]);

    $product = Product::findOrFail($id);

    $data = [
        'name' => $request->name,
        'price' => $request->price,
        'id_categoria' => $request->id_categoria,
        'descricao' => $request->descricao ?? $product->descricao,
        'ativo' => $request->ativo ?? $product->ativo,
    ];

    if ($request->hasFile('imagem')) {
        $arquivo = $request->file('imagem');
        $nomeArquivo = time() . '.' . $arquivo->getClientOriginalExtension();

    // Deleta imagem antiga no R2 se existir
    if ($product->imagem) {
        // Extrai o nome do arquivo antigo da URL
        $caminhoAntigo = str_replace('https://cdn.amorcomrecheio.shop/imagens/', '', $product->imagem);

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

    if($request->ativo){
        Promocao::where('Id_Product', $id)->update(['ativo' => false]);
    }


    $product->update($data);

    return redirect()->route('Produtos')->with('success', 'Produto atualizado com sucesso!');
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): RedirectResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('Produtos');
    }
}
