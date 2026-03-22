<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\cart_product;
use App\Models\Cart;
use App\Models\Promocao;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;


class CartProductController extends Controller
{
    
  
    public function index()
    {
        $userId = auth()->user()->id;  // Obtendo o id do usuário logado
      
   /*  DB::table('cart_product')
    ->join('product', 'cart_product.Id_Product', '=', 'product.id')
    ->join('cart', 'cart_product.Id_Cart', '=', 'cart.id')
    ->join('promocao', 'cart_product.Id_Promo', '=', 'promocao.id')
    ->join('category', 'product.id_categoria', '=', 'category.id')
    ->where('cart.Id_User', $userId)
    ->where(function ($query) {
        $query->where('product.ativo', 0)
              ->orwhere('category.ativo', 0)
              ->where('promocao.ativo', 0);
    })
    ->delete();
*/

$cartItems = DB::table('cart_product as cp')
    ->leftJoin('promocao as pro', 'cp.Id_Promo', '=', 'pro.id')
    ->leftJoin('cart as c', 'c.id', '=', 'cp.Id_Cart')
    ->leftJoin('product as p', 'p.id', '=', 'cp.Id_Product')
    ->where('c.id_user', $userId)
    ->select(
        'cp.*', 
        'pro.ativo as promo_ativo',
        'p.ativo as produto_ativo'
        )
    ->get();

foreach ($cartItems as $item) {
    //Promoção Ativa e Item Inativo
    if ($item->promo_ativo == 1 && $item->produto_ativo == 0) {
        DB::table('cart_product')
        ->where('id', $item->id)
        ->where('promo', false)
        ->delete();
        
        //Promoção Inativa e Produto ativo
    } else if ($item->promo_ativo == 0 && $item->produto_ativo == 1) {
        DB::table('cart_product')
        ->where('id', $item->id)
        ->where('promo', true)
        ->delete();

        //tudo inativo
    }else{
        DB::table('cart_product')->where('id', $item->id)->delete();
    }
}


         // Realiza o INNER JOIN entre a tabela cart_product, cart, product e promocao

   $cartProducts = DB::table('cart_product as cp')
    ->leftJoin('product as p', 'cp.Id_Product', '=', 'p.id')
    ->leftJoin('promocao as pro', 'cp.Id_Promo', '=', 'pro.id')
    ->leftJoin('product as promo_prod', 'pro.Id_Product', '=', 'promo_prod.id')
    ->join('cart as c', 'cp.Id_Cart', '=', 'c.id')
    ->select(
        'cp.Id_Cart',
        'cp.Id_Product',
        'cp.Id_Promo',
        'cp.quantity',
        'cp.promo as isPromo',
        
        // Dados do produto direto (caso não seja promoção)
        'p.name as product_name',
        'p.imagem as product_image',
        'p.descricao as product_description',
        'p.price as product_price',
        'p.id_categoria as product_Id_Category',
        
        // Dados da promoção
        'pro.nome as promo_name',
        'pro.price as promo_price',
        'pro.quantidade as promo_quantity',
        'pro.descricao as promo_description',
        'pro.imagem as promo_image',
        'pro.Id_Product as promo_Id_Product',
        
        
        'c.Id_User'
    )
    ->where('c.Id_User', auth()->id())
    ->get();


    
       
        // Retorna os dados para a view
        return Inertia::render('Cart/Cart', [
    'cartProducts' => $cartProducts ?? [],
]);
    }
public function store(Request $request)
{
    // Validação
    $request->validate([
        'product_id' => 'nullable|exists:product,id',
        'is_promo' => 'nullable|boolean',
        'price' => 'nullable|numeric',
        'promo_id' => 'nullable|exists:promocao,id',
        'quantidade' => 'nullable|integer|min:1',
    ]);



    // Obtem o carrinho do usuário logado
    $cart = Cart::where('id_user', Auth::id())->first();

    if (!$cart) {
        return response()->json(['message' => 'Carrinho não encontrado.'], 404);
    }

    // Checar se o produto já está no carrinho
    $existingProduct = DB::table('cart_product')
        ->where('Id_Cart', $cart->id)
        ->where('Id_Product', $request->product_id)
        ->where('promo', $request->is_promo ?? false) // garante que não misture normal com promocional
        ->where('Id_Promo', $request->promo_id)
        ->first();

    if ($existingProduct) {
        // Produto já existe no carrinho: aumenta a quantidade
        DB::table('cart_product')
            ->where('id', $existingProduct->id)
            ->update([
                'quantity' => $existingProduct->quantity + ($request->quantidade ?? 1),
            ]);
    } else {
        // Produto novo: insere
        DB::table('cart_product')->insert([
            'Id_Cart' => $cart->id,
            'Id_Product' => $request->product_id,
            'quantity' => $request->quantidade ?? 1,
            'preco' => $request->price ?? null,
            'promo' => $request->is_promo ?? false,
            'Id_Promo' => $request->promo_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    return Redirect::back()->with('success', 'Produto adicionado ao carrinho!');
}
public function update(Request $request)
{
    $productId = $request->input('product_id');
    $quantity = $request->input('quantity');

    $userId = auth()->user()->id; // Obtém o ID do usuário logado

    // Obtém o carrinho do usuário
    $cart = DB::table('cart')
        ->where('Id_User', $userId)
        ->first();

    if (!$cart) {
        return Redirect::back()->with('error', 'Carrinho não encontrado.');
    }

    // Verifica se o produto existe no carrinho
    $cartProduct = DB::table('cart_product')
        ->where('Id_Cart', $cart->id)
        ->where('Id_Product', $productId)
        ->first();

        
    if ($cartProduct) {
            DB::table('cart_product')
            ->where('Id_Product', $productId)
            ->where('Id_Cart', $cart->id)
            ->update(['quantity' => $quantity]);
       

        return Redirect::back()->with('success', 'Carrinho atualizado!');
    }

    return Redirect::back()->with('error', 'Produto não encontrado no carrinho.');
}


/**
 * Remove the specified resource from storage.
 */
public function destroy(Request $request)
{
    $productId = $request->input('product_id');

    $userId = auth()->user()->id; // Obtém o ID do usuário logado

    // Obtém o carrinho do usuário
    $cart = DB::table('cart')
        ->where('Id_User', $userId)
        ->first();

    if (!$cart) {
        return Redirect::back()->with('error', 'Carrinho não encontrado.');
    }

     // Verifica se o produto existe no carrinho
     $cartProduct = DB::table('cart_product')
     ->where('Id_Cart', $cart->id)
     ->where('Id_Product', $productId)
     ->first();

     if ($cartProduct) {
            // Exclui o PRoduto do Carrinho
            DB::table('cart_product')
            ->where('Id_Product', $productId)
            ->where('Id_Cart', $cart->id)
            ->delete();
            return Redirect::back()->with('success', 'Carrinho atualizado!');
        } 
        return Redirect::back()->with('error', 'Produto não encontrado no carrinho.');
        
    }

   
}

