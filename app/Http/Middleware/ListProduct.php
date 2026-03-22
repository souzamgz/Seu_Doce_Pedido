<?php

namespace App\Http\Middleware;


use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use App\Models\Banner;

class ListProduct
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $products = Product::all();
        $categories = Category::all();

        Inertia::share("categories", $categories);
        Inertia::share("products", $products);
        
        return $next($request);
    }
}
