<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banner;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{


public function store(Request $request)
{
    $request->validate([
        'nome' => 'required|string|max:255',
        'imagem' => 'required|file|image|mimes:jpg,jpeg,png|max:2048', // max 2MB
    ]);

    $urlImagem = null;

    if ($request->hasFile('imagem')) {
        $arquivo = $request->file('imagem');
        $ImagemName = time() . '.' . $arquivo->getClientOriginalExtension();

        // Upload para R2 (bucket configurado no filesystems.php)
        Storage::disk('r2_produtos')->put('banner/' . $ImagemName, file_get_contents($arquivo));

        // Monta URL pública CDN para salvar no banco
        $urlImagem = 'https://cdn.amorcomrecheio.shop/banner/' . $ImagemName;
    }

    Banner::create([
        'nome' => $request->nome,
        'imagem' => $urlImagem, // Salva a URL completa aqui
    ]);
}



    public function edit(string $id)
    {
        $banner = Banner::findOrFail($id);

        return Inertia::render('Banners/Edit', [
            'banner' => $banner,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'imagem' => 'required|string|max:255',
        ]);

        $banner = Banner::findOrFail($id);
        $banner->update($request->only('nome', 'imagem'));

        return redirect()->route('banners.index');
    }

    public function destroy($id)
{
    $banner = Banner::findOrFail($id);
    
    // Se quiser remover o arquivo físico:
     Storage::delete($banner->imagem); // se o caminho for do Storage

    $banner->delete();

   
}
}
