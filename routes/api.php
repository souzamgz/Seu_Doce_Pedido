<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MercadoPagoController;




Route::post('/webhook/mercadopago', [MercadoPagoController::class, 'webhook']);


