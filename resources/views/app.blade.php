<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Amor Com Recheio') }}</title>

        <link rel="shortcut icon" href="imagens/Logo_Original - Editado.png" type="image/x-icon">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="css/style.css">
        <link rel="stylesheet" href="css/csswelcome.css">
         <link rel="stylesheet" href="css/cssParaProducts.css">
          <link rel="stylesheet" href="css/cssCarrossel.css">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
         <!-- Tirar Na produção
          
         -->
         @viteReactRefresh 
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
