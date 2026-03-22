<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CategoryController extends Controller
{
    /**
     * Display the categories list view.
     */
    public function index(): Response
    {
        $categories = Category::all();

        // Convertendo as categorias para um array para garantir que os dados sejam passados de forma compatível
        $categories = $categories->toArray();

        return Inertia::render('Admin/Category/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Display the create category form.
     */

    /**
     * Store a newly created category in the database.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'imagem' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imagemNome = null;

         if ($request->hasFile('imagem')) {
        $imagemNome = time() . '.' . $request->imagem->extension();
        $request->imagem->move(public_path('imagens/categorias'), $imagemNome);
    }

        Category::create([
            'name' => $request->name,
            'imagem' => $imagemNome,
        ]);

        return redirect()->route('Categorias');
    }

    /**
     * Display the specified category.
     */
    public function show($id): Response
    {
        $category = Category::findOrFail($id);
        return Inertia::render('Admin/Category/Show', [
            'category' => $category
        ]);
    }

    /**
     * Show the form for editing the specified category.
     */

    /**
     * Update the specified category in the database.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'imagem' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'ativo' => 'nullable|boolean',
        ]);
        $categoria = Category::findOrFail($id);
        $imagemNome = null;

        if ($request->hasFile('imagem')) {
    $image = $request->file('imagem');
    $imagemNome = time() . '.' . $image->getClientOriginalExtension();
    $image->move(public_path('imagens/categorias'), $imagemNome);
    $categoria->imagem = $imagemNome;
}

        if($imagemNome){
        $categoria->update([
            'name' => $request->name,
            'imagem' => $imagemNome,
            'ativo' => $request->ativo,
        ]);
        }else{
             $categoria->update([
            'name' => $request->name,
            'ativo' => $request->ativo,
        ]);
        }    
        

        return redirect()->route('Categorias');
    }

    /**
     * Remove the specified category from the database.
     */
    public function destroy($id): RedirectResponse
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return redirect()->route('Categorias');
    }
}
