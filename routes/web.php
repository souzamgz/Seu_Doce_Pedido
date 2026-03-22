<?php
use App\Http\Middleware\CheckIfAdmin;
use App\Http\Middleware\EmailVerifiedAt;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartProductController;
use App\Http\Controllers\CartWLController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\MercadoPagoController;
use App\Http\Controllers\InformacoesPessoaisController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\VendaController;
use App\Http\Controllers\CupomController;
use App\Http\Controllers\PromocaoController;


// Area de Testes 


// Area de Testes 

Route::post('/cartwl/add', [CartWLController::class, 'store']);
Route::get('CarrinhoWL', [CartWLController::class, 'index']);
Route::post('/update', [CartWLController::class, 'update']);
Route::post('/remove', [CartWLController::class, 'destroy']);

//Rotas do Checkout




Route::get('/success', 
[CheckoutController::class, 'success'])
->name('success');


Route::get('/failure', 
[CheckoutController::class, 'failure'])->name('failure');

Route::get('/Retirada',  function (){
    return Inertia::render('Checkout/Retirada');
})->name('Retirada');

Route::get('/pending', [CheckoutController::class, 'pending'])
->name('pending');

Route::get('/CheckoutRedirect', function () {
        return Inertia::render('Checkout/CheckoutRedirect');
})->name('CheckoutRedirect');

Route::get('/CheckoutRedirectWL', function () {
        return Inertia::render('Checkout/CheckoutRedirectWL');
})->name('CheckoutRedirectWL');

Route::get('/sobre', function(){
    return Inertia::render('Sobre/Sobre');
})->name('sobre');

//Middleware de Usuario Autenticado
Route::middleware('auth')->group(function () {
 

Route::get('/pagardepois/{venda}', [CheckoutController::class, 'pagarDepois'])
    ->name('venda.pagarDepois');


Route::post('/pagamento-retirada/{venda}', [VendaController::class, 'definirPagamentoRetirada'])
    ->name('venda.pagamentoRetirada')
    ->middleware('auth');




    // Rota para a verificação do email
 Route::get('/VerifyEmail', function () {
    return Inertia::render('Auth/VerifyEmail');
})->name('VerifyEmail'); 

//Rota de Informações Pessoais



Route::post('/informacoes', [InformacoesPessoaisController::class, 'storeOrUpdate'])
    ->name('informacoes.storeOrUpdate')
    ->middleware('auth');


Route::delete('/informacoes/{id}', [InformacoesPessoaisController::class, 'destroy'])
    ->name('informacoes.destroy')
    ->middleware('auth');


// As rotas de administração e categorias ficam dentro do middleware de autenticação e do middleware CheckIfAdmin
//Route::middleware(EmailVerifiedAt::class)->group(function () {
    //Middleware para Somente Admins
    Route::middleware([CheckIfAdmin::class])->group(function () {
        // Rota para a administração do painel
        Route::get('/Administracao', function () {
            return Inertia::render('Admin/DashboardAdmin');
        })->name('Administracao');

        Route::get('/Vendas',  
        [CheckoutController::class, 'index'])
        ->name('vendas.index');

        //Rota Promoção

        Route::get('/Promocao', function(){
            return Inertia::render('Admin/Promocao/Promocoes');
        })->name('Promocao');

        Route::get('/promocoes/{id}/edit', [PromocaoController::class, 'edit'])
        ->name('promocoes.edit');

 

        // Rota para os produtos
        Route::get('/Produtos', function () {
            return Inertia::render('Admin/Product/Product');
        })->name('Produtos');

        // Rota para as categorias
        Route::get('/Categorias', function () {
            return Inertia::render('Admin/Category/Categories');
        })->name('Categorias');



        
          // Rota para os cupons
        Route::get('/Cupom', function () {
            return Inertia::render('Admin/Cupom/Cupom');
        })->name('Cupom');

        Route::apiResource('cupons', CupomController::class);

        Route::post('/cupons/aplicar', [CupomController::class, 'aplicarCupom'])->name('cupons.aplicar');
         Route::get('/carregarCupom', [CupomController::class, 'meusCupons'])->name('carregarCupom');

        // Rota para alternar status de admin de usuário
        Route::post('/admin/toggle/{id}', [AdminController::class, 'toggleAdmin'])
            ->name('admin.toggle');

        // Rota para as categorias, com as funcionalidades do CRUD
        Route::resource('categories', CategoryController::class);

        // Rota para os produtos, com as funcionalidades do CRUD
        Route::resource('products', ProductController::class);


        Route::get('/VendasLayout', function(){
            return Inertia::render('Admin/Vendas/VendasLayout');
        })->name('VendasLayout');

        Route::post('/admin/vendas/{id}/status', [VendaController::class, 'atualizarStatus'
    ])->name('vendas.atualizarStatus');

    Route::post('/admin/vendas/{id}/cancelar', [VendaController::class, 'cancelar'
    ])->name('vendas.cancelar');

    
// Rotas de Promoção

Route::resource('promocoes', PromocaoController::class);

//Rotas do Banner


Route::resource('banners', BannerController::class);
Route::delete('/banners/{id}', [BannerController::class, 'destroy'])->name('banners.destroy');

//Rotas do Shop

Route::get('/shop/banner', [ShopController::class, 'index']); // para carregar os banners
Route::post('/shop/atualizar', [ShopController::class, 'update']); // para alterar o banner
Route::post('/alterar-telefone', [ShopController::class, 'alterar-telefone']); // para alterar o telefone

        // Finaliza CheckifAdmin
    });



    // Rota para o dashboard do usuário
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');    

      // Rota Carts
      Route::get('/Carrinho', function () {
        return Inertia::render('Cart/Cart');
    })->name('Carrinho');

    Route::get('/CarrinhoDeCompra', [CartProductController::class, 'index'])->name('CarrinhoDeCompra');
    Route::post('/cart/add', [CartProductController::class, 'store']);
    Route::post('/updateC', [CartProductController::class, 'update']);
    Route::post('/deleteC', [CartProductController::class, 'destroy']);
    
    // Rota Pedido
      Route::get('/MeusPedidos', function () {
        return Inertia::render('Pedido/MeusPedidos');
    })->name('MeusPedidos');

    Route::get('/MeusCupons', function () {
        return Inertia::render('Cupom/MeusCupons');
    })->name('MeusCupons');

    // Rota Pedido PHP
      Route::get('/MeusPedidos', [CheckoutController::class, 'meuspedidos']);

     
    Route::post('/meus-pedidos/{id}/cancelar', [CheckoutController::class, 'cancelarPedido']);



    // Rotas de perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //Finaliza Auth
// });
// Finaliza EmailVerifiedAt
});



Route::match(['get', 'post'], '/pagar', [MercadoPagoController::class, 'pagar'])->name('pagar');
Route::match(['get', 'post'], '/pagarWL', [MercadoPagoController::class, 'pagarWL'])->name('pagarWL');

Route::get('/pagamento/sucesso', fn() => 'Pagamento aprovado!')->name('pagamento.sucesso');
Route::get('/pagamento/falha', fn() => 'Pagamento falhou!')->name('pagamento.falha');
Route::get('/pagamento/pendente', fn() => 'Pagamento pendente!')->name('pagamento.pendente');



require __DIR__.'/auth.php';

