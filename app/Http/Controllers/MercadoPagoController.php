<?php

namespace App\Http\Controllers;

use Carbon\Traits\ToStringFormat;
use App\Jobs\SendNewOrderWhatsAppNotification;
use Illuminate\Http\Request;
use App\Services\WhatsAppService;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Exceptions\MPApiException;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Venda;
use App\Models\VendaProduct;
use App\Models\CupomUser;
use Illuminate\Support\Facades\Log;
use MercadoPago\Payment;
  use MercadoPago\Client\Payment\PaymentClient;

class MercadoPagoController extends Controller
{
   
 public function webhook(Request $request)
{
    $data = $request->all();
    Log::info('Webhook MercadoPago recebido:', $data);

    if (isset($data['type']) && $data['type'] === 'payment') {
        $paymentId = $data['data']['id'] ?? null;
        Log::info('Só essa informação passa', $data);
        if ($paymentId) {
             try {
                $accessToken = config('services.mercadopago.token');
                    if (!$accessToken) {
                        Log::error('Token do Mercado Pago não configurado. Verifique .env e config/services.php');
                        return response()->json(['status' => 'error', 'message' => 'Token not configured'], 500);
                    }
                    MercadoPagoConfig::setAccessToken($accessToken);
                    
             $client = new PaymentClient();
            $payment = $client->get($paymentId);

            Log::info('Aqui tem o objeto do cliente', $data);
            $externalRef = $payment->external_reference;

            if ($externalRef) {
                $venda = Venda::find($externalRef);
                if ($venda) {
                    $statusMP = $payment->status; 

                    $paymentType = $payment->payment_type_id;

                    $venda->status = match($statusMP) {
                        'approved' => 'pago',
                        'pending' => 'pagamento_pendente',
                        'rejected', 'refused', 'cancelled' => 'falha_pagamento',
                        default => $venda->status
                    };

                    $venda->forma_pagamento = $paymentType;

                    if (isset($venda->mercadopago_payment_id)) {
                        $venda->mercadopago_payment_id = $payment->id;
                    }

                    $venda->save();
                    Log::info("SUCESSO: Venda ID {$venda->id} foi atualizada para o status '{$venda->status}'.");
                }
            }else {
                Log::warning("AVISO: Venda com external_reference {$externalRef} não foi encontrada no banco de dados.");
                }
            } catch (\Exception $e) {
                    Log::error('ERRO ao processar webhook do Mercado Pago:', ['message' => $e->getMessage(), 'payment_id' => $paymentId]);
                    return response()->json(['status' => 'error'], 500);
                }
        }
    }

    return response()->json(['status' => 'ok'], 200);
}




   public function pagar(Request $request)
{
    if ($request->method() === "POST") {
        try {
 


            $user = auth()->user();

            if($user->admin){
                $accessToken = config('services.mercadopago.tokentest');
            }else{
                $accessToken = config('services.mercadopago.token');
            }
            

            if (!$accessToken) {
            abort(500, 'Token do Mercado Pago não configurado.');
            }
            MercadoPagoConfig::setAccessToken($accessToken);

            $informacoes  = $request->input('informacoes');
            $products = $request->input('products');
            $tipoPedido = $request->input('tipoPedido', 'retirada'); 

            $items = [];
    
            $total = 0;

    

            // Adiciona produtos ao array de items
            foreach ($products as $product) {
                $items[] = [
                    "id" => $product['id_product'] ?? $product['id_promo'],
                    "title" => $product['name'],
                    "quantity" => (int) $product['quantity'],
                  /*  "picture_url" => 'http://127.0.0.1:8000/imagem/' . $product['imagem'],*/ //usar quando hospedado
                    "description" => $product['description'],
                    "currency_id" => "BRL",
                    "unit_price" => max((float) $product['price'], 0.01),

                ];
                $total += $product['price'] * $product['quantity'];
            }

            

            // Se for entrega, adiciona taxa de entrega + dados de endereço
            if ($tipoPedido === 'entrega') {
                $items[] = [
                    "id" => "delivery_fee",
                    "title" => "Taxa de entrega",
                    "quantity" => 1,
                    "currency_id" => "BRL",
                    "unit_price" => 5, // valor fixo da entrega (precisa aplicar api para dinamizar)
                ];
                $frete = 5;
                $total += $frete;
                 $payer = [
        "name" => $user->name,
        "email" => $user->email,
        "phone" => [
            "number" => (string) $informacoes['telefone'],
        ],
    ];  
            }else{
               
                   
    $payer = [
        "name" => $user->name,
        "email" => $user->email,
        "phone" => [
            "number" => (string) $informacoes['telefone'],
        ],
    ];  
                
                 $frete = 0.00;
            }


            $client = new PreferenceClient();

$cupom = $request->input('cupom'); // dados do cupom, se existir
      // 1. Cria a venda no banco
$venda = Venda::create([
    'id_user' => $user->id,
    'status' => 'iniciado',
    'valor' => $total,
    'cupom_id' => $cupom['id'] ?? null,
    'tipo' => $request->tipoPedido,
    'nome' => $user->name,
    'email' => $user->email,
    'telefone' => $request->informacoes['telefone'] ?? null,
    // Só adiciona o endereço se for entrega
    'rua' => $request->endereco['rua'] ?? null,
    'numero' => $request->endereco['numero'] ?? null,
    'bairro' => ($request->endereco['bairro'] ?? null),
    'cidade' => ($request->endereco['cidade'] ?? null), 
    'estado' => ($request->endereco['estado'] ?? null),
    'cep' => $request->endereco['cep'] ?? null,
    'complemento' => $request->endereco['complemento'] ?? null,
]);



// 2. Cria a preferência Mercado Pago usando o id da venda
$preference = $client->create([
    "items" => $items,
    "payer" => $payer,
    "binary_mode" => true,
    "external_reference" => $venda->id
]);


// 3. Salva a URL do pagamento na venda
$venda->payment_url = $preference->init_point ?? null;
$venda->save();

 
 $tipoCupom = null;
$subtotal = 0;
$totalComDesconto = 0;

// 2. Salva os produtos da venda
foreach ($products as $product) {
    $unitPrice = (float) $product['price']; 
    $originalPrice = $unitPrice;
    $categoriaNome = null;
    if (!empty($product['id_category'])) {
        $categoriaNome = DB::table('category')
            ->where('id', $product['id_category'])
            ->value('name'); 
    }
$cupomId;
$valorDesconto = 0;
    // Aplica desconto do cupom
    if ($cupom && $cupom['ativo']) {
        $cupomId = $cupom['id'];
        $valorDesconto = $cupom['valor_desconto'];
        if ($cupom['tipo_desconto'] === 'valor') {
            $tipoCupom = 'valor';
            // Desconto fixo proporcional ao produto
            $unitPrice -= $cupom['valor_desconto'] / count($products);
        } elseif ($cupom['tipo_desconto'] === 'percentual') {
            $tipoCupom = 'percentual';
            // Desconto percentual
            $unitPrice -= $unitPrice * ($cupom['valor_desconto'] / 100);
        }
        $cupomUser = CupomUser::where('user_id', auth()->id())
        ->where('cupom_id', $cupom['id'])
        ->first();

    if ($cupomUser) {
        $cupomUser->incrementarUso();
    }
    }

    // Garante que o preço não fique negativo
    if ($unitPrice < 0) {
        $unitPrice = 0;
    }

    // Calcula subtotal (preço original) e total com desconto
    $subtotal += $originalPrice * $product['quantity'];
    $totalComDesconto += $unitPrice * $product['quantity'];



    VendaProduct::create([
        'id_venda' => $venda->id,
        'id_product' => $product['id_product'] ?? null,
        'nome' => $product['name'] ?? $product['promo_name'],
        'preco' => $unitPrice, // <-- apenas o preço do produto com desconto
        'descricao' => $product['description'] ?? '',
        'imagem' => $product['imagem'] ?? '',
        'id_category' => $product['id_categoria'] ?? null,
        'id_promocao' => $product['id_promo'] ?? null,
        'categoria' => $categoriaNome ?? 'Sem categoria',
        'quantity' => $product['quantity'],
        'kitquantity' => $product['kitquantity'] ?? null,
    ]);
}


        

            // Busca os produtos do carrinho para mostrar no retorno
            $userId = auth()->id();

            $cart = DB::table('cart')
                ->where('id_user', $userId)
                ->first();

             // Realiza o INNER JOIN entre a tabela cart_product, cart, product e promocao

   $Checkoutproducts = DB::table('cart_product as cp')
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



            DB::table('cart_product')
                ->where('Id_Cart', $cart->id)
                ->delete();

            return Inertia::render('Checkout/CheckoutRedirect', [        
                'cartItems' => $Checkoutproducts,
                'venda' => $venda,
                'userAddress' => $tipoPedido === 'entrega' ? true : null,
                'isPickup' => $tipoPedido === 'retirada',
                'frete' => $frete,
                'init_point' => $preference->init_point,
                'subtotal' => $subtotal,        
                'totalComDesconto' => $totalComDesconto,
                'valorDesconto' => $valorDesconto,
                'tipoCupom' => $tipoCupom,
            ]);
        } catch (MPApiException $e) {
            return response()->json([
                'message' => 'Erro na API do Mercado Pago',
                'error' => $e->getApiResponse()->getContent()
            ], 500);
        }
    } else {
        return Inertia::render('Dashboard');
    }
}
  public function pagarWL(Request $request)
{
    if ($request->method() === "POST") {
        try {

            $accessToken = config('services.mercadopago.token');

            if (!$accessToken) {
            abort(500, 'Token do Mercado Pago não configurado.');
            }
            MercadoPagoConfig::setAccessToken($accessToken);

            $products = $request->input('products');
            $tipoPedido = $request->input('tipoPedido', 'retirada'); 
            $dadosEntrega = $request->input('dadosEntrega');

            $items = [];
            $total = 0;
            $payer =[];

            // Adiciona produtos ao array de items
            foreach ($products as $product) {
                $items[] = [
                    "id" => $product['id'],
                    "title" => $product['name'],
                     /*  "picture_url" => 'http://127.0.0.1:8000/imagem/' . $product['imagem'],*/ //usar quando hospedado
                     "description" => $product['description'],
                     "quantity" => (int) $product['quantity'],
                    "currency_id" => "BRL",
                    "unit_price" => max((float) $product['price'], 0.01),

                    "imagem" => $product['imagem'] ?? null,
                ];
                $total += $product['price'] * $product['quantity'];
            }

            

            // Se for entrega, adiciona taxa de entrega + dados de endereço
            if ($tipoPedido === 'entrega') {
                $items[] = [
                    "id" => "delivery_fee",
                    "title" => "Taxa de entrega",
                    "quantity" => 1,
                    "currency_id" => "BRL",
                    "unit_price" => 5, // valor fixo da entrega (precisa aplicar api para dinamizar)
                ];
                $frete = 5;
                $total += $frete;
                 $payer = [
            "name" => $dadosEntrega['nome'],
            "phone" => [
            "number" => $dadosEntrega['telefone'],
            ],
        ];
            }else{
        $payer = [
            "name" => $dadosEntrega['nome'],
            "phone" => [
            "number" => $dadosEntrega['telefone'],
            ],
        ];
                 $frete = 0.00;
            }





            $client = new PreferenceClient();



                // 1. Cria a venda no banco
        $venda = Venda::create([
         'status' => 'iniciado',
        'valor' => $total,
        'tipo' => $tipoPedido, // retirada ou entrega
        'nome' => $dadosEntrega['nome'],
        'email' => $dadosEntrega['email'],
        'telefone' => $dadosEntrega['telefone'],
        'endereco' => $dadosEntrega['bairro']  . ' - ' . $dadosEntrega['cidade'] ?? null,
        'rua' => $dadosEntrega['rua'] ?? null,
        'numero' => $dadosEntrega['numero'] ?? null,
        'cep' => $dadosEntrega['cep'] ?? null,
        ]);




        // 2. Salva os produtos da venda
    foreach ($products as $product) {
    $categoriaNome = null;
    if (!empty($product['id_category'])) {
        $categoriaNome = DB::table('category')
            ->where('id', $product['id_category'])
            ->value('name'); 
    }

     VendaProduct::create([
        'id_venda' => $venda->id,
        'id_product' => $product['id_product'] ?? null,
        'nome' => $product['name'],
        'preco' => $product['price'],
        'descricao' => $product['description'] ?? '',
        'imagem' => $product['imagem'] ?? '',
        'id_category' => $product['id_categoria'] ?? null, // se tiver
        'id_promocao' => $product['id_promo'] ?? null, // se tiver
        'categoria' => $categoriaNome ?? 'Sem categoria',
        'quantity' => $product['quantity'],
        'kitquantity' => $product['kitquantity'] ?? null,
    ]);
    }

    


            session()->put('cart');
            // Cria a preferência Mercado Pago
            $preference = $client->create([
                "items" => $items,
                "payer" => $payer,
                "binary_mode" => true,
                "external_reference" => $venda->id
            ]);


            return Inertia::render('Checkout/CheckoutRedirectWL', [
                'init_point' => $preference->init_point,
                'cartItems' => $products,
                'dadosEntrega' => $dadosEntrega,
                'userAddress' => $tipoPedido === 'entrega' ? true : null,
                'isPickup' => $tipoPedido === 'retirada',
                'frete' => $frete,
            ]);
        } catch (MPApiException $e) {
            return response()->json([
                'message' => 'Erro na API do Mercado Pago',
                'error' => $e->getApiResponse()->getContent()
            ], 500);
        }
    } else {
        return Inertia::render('Dashboard');
    }
}
        
}
