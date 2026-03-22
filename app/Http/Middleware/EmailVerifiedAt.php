<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmailVerifiedAt
{
    /**
     * Handle an incoming request
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
 // Verifica se o usuário está autenticado
 if (!auth()->check()) {
    return redirect()->route('login');
}
    // Se estiver logado, mas não tiver e-mail verificado
    if (!$request->user()->email_verified_at) {
    return redirect()->route("verification.notice");
    }
     
   return $next($request);
    }
}
