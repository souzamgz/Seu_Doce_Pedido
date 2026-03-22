<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;

class AdminController extends Controller
{
    //
    //Função que terna Alguém Administrador
    public function toggleAdmin($id)
    {
        $usuario = User::findOrFail($id);
        $usuario->admin = !$usuario->admin; // Alterna entre true e false
        $usuario->save();

        return Redirect::back()->with('success', 'Status de admin atualizado!');
    }
}
