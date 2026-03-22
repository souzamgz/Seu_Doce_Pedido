<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CartWLController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cart = session()->get('cart', []); // Obtém o carrinho da sessão


        return Inertia::render('Cart/CartWL', [
            'cart' => $cart
        ]);

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
    $cart = session()->get('cart', []);

    $productId = $request->input('product_id');
    $quantity = $request->input('quantity', 1);
    $isPromo = $request->input('is_promo', false);
    $promoId = $request->input('promo_id');
    $price = $request->input('price');
    $kitquantidade = $request->input('kitquantidade', 1);

    // Cria uma chave única para produto ou promoção
    $itemKey = $isPromo ? "promo_{$promoId}" : "product_{$productId}";

    // Se já existe no carrinho, soma quantidade
    if (isset($cart[$itemKey])) {
        $cart[$itemKey]['quantity'] += $quantity;
    } else {
        $cart[$itemKey] = [
            'product_id' => $productId,
            'is_promo' => $isPromo,
            'promo_id' => $promoId,
            'quantity' => $quantity,
            'kitquantidade' => $kitquantidade,
        ];
    }

    session()->put('cart', $cart);

    return Redirect::back()->with('success', 'Produto adicionado ao carrinho!');
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
   public function update(Request $request)
{
    $quantity = (int) $request->input('quantity');
    $itemKey = $request->input('key');

    // Recupera o carrinho da sessão
    $cart = session()->get('cart', []);

    // Verifica se o item existe no carrinho
    if (isset($cart[$itemKey])) {
        if ($quantity > 0) {
            // Atribui a nova quantidade diretamente
            $cart[$itemKey]['quantity'] = $quantity;
        } else {
            // Remove se quantidade for 0 ou negativa
            unset($cart[$itemKey]);
        }

        // Atualiza o carrinho na sessão
        session()->put('cart', $cart);

        return Redirect::back()->with('success', 'Carrinho atualizado com sucesso!');
    }

    return Redirect::back()->with('error', 'Produto não encontrado no carrinho.');
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
         $itemKey = $request->input('key');
    
        // Aqui você deve implementar a lógica para remover o produto do carrinho (session ou banco de dados)
        // Por exemplo:
        $cart = session()->get('cart', []);
        if (isset($cart[$itemKey])) {
            unset($cart[$itemKey]);
            session()->put('cart', $cart);
        }
        
        return Redirect::back()->with('success', 'Produto Removido com Sucesso');
    }
}
