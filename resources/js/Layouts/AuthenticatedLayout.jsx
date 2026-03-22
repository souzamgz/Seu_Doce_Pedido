import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setShowMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Faixa superior */}
            <div
                className="bg-[#613d20] text-center text-xs py-1 font-poppins text-white"
                style={{ letterSpacing: '0.05em' }}
            >
                <span className="font-bold">
                    Sua felicidade começa com um doce &&nbsp;
                </span>
                <span className="font-normal">
                    cuidamos de cada detalhe pra ela durar muito mais!
                </span>
            </div>



            {/* Header */}
            <header className="bg-white shadow-md relative">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between py-5">
                    {/* Logo e nome */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link href="/dashboard">
                                <img
                                    src="/imagens/Banner sem fundo.png"
                                    alt="Logo"
                                    width="300"
                                    height="300"
                                    className="object-contain"
                                />
                            </Link>
                        ) : (
                            <Link href="/">
                                <img
                                    src="/imagens/Banner sem fundo.png"
                                    alt="Logo"
                                    width="300"
                                    height="300"
                                    className="object-contain"
                                />
                            </Link>
                        )}


                    </div>

                    {/* Navegação - visível em telas grandes */}
                    <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-gray-700">
                        {user ? (
                            <>
                                {user.admin === 1 && (
                                    <Link href="/Administracao" className="hover:text-[#8a5a33] transition-colors duration-300 text-base">
                                        ADMINISTRAÇÃO
                                    </Link>
                                )}
                                <Link href="/dashboard" className="hover:text-[#8a5a33] transition-colors duration-300 text-base ">
                                    CATÁLOGO
                                </Link>
                                <Link href="/CarrinhoDeCompra" className="hover:text-[#8a5a33] transition-colors duration-300 text-base ">
                                    CARRINHO
                                </Link>
                                <Link href="/MeusPedidos" className="hover:text-[#8a5a33] transition-colors duration-300 text-base ">
                                    MEUS PEDIDOS
                                </Link>
                                
                               
                            </>
                        ) : (
                            <>
                                <Link href="/" className="hover:text-[#8a5a33] transition-colors duration-300 text-base ">
                                    CATÁLOGO
                                </Link>
                                <Link href="/CarrinhoWL" className="hover:text-[#8a5a33] transition-colors duration-300 text-base ">
                                    CARRINHO
                                </Link>
                            </>
                        )}

                        <Link href="/sobre" className="hover:text-[#8a5a33] transition-colors duration-300 text-base">
                            SOBRE
                        </Link>
                        {user ? (
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="bg-[#613d20] text-white px-4 py-2 rounded-md hover:bg-[#8a5a33] transition-colors duration-300 shadow-md text-base"
                            >
                                {user.name}
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-[#613d20] text-white px-4 py-2 rounded-md hover:bg-[#8a5a33] transition-colors duration-300 shadow-md"
                            >
                                LOGIN
                            </Link>
                        )}

                    </nav>

                    {/* Botão hamburguer - visível em telas pequenas */}
                    <button
                        onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}

                        className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-white hover:bg-[#613d20] focus:outline-none transition "

                    >
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            {showingNavigationDropdown ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Menu suspenso do usuário (desktop) */}
                {showMenu && (
                    <div className="absolute right-4 top-[90px] w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 text-center">
                            <div className="text-lg font-semibold text-[#613d20]">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                        <div className="flex flex-col items-center py-2">
                            <ResponsiveNavLink
                                href={route('profile.edit')}

                                className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-[#8a5a33] hover:text-[#613d20] transition rounded text-base"

                            >
                                Perfil
                            </ResponsiveNavLink>
                              <ResponsiveNavLink
    href={route('MeusCupons')} // use o name da rota aqui
    className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-[#8a5a33] hover:text-[#613d20] transition rounded text-base"
>
    Meus Cupons
</ResponsiveNavLink>

                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"

                                className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-[#8a5a33] hover:text-[#613d20] transition rounded text-base"

                            >
                                Sair
                            </ResponsiveNavLink>

                        

                        </div>
                    </div>
                )}

                {/* Menu responsivo para mobile */}
                {showingNavigationDropdown && (
                    <div className="sm:hidden absolute top-full right-4 mt-2 bg-white shadow-lg rounded-md py-2 px-4 z-50 w-64 space-y-2 text-sm font-medium">
                        {user ? (
                            <>
                                {user.admin === 1 && (
                                    <Link href="/Administracao" className="block text-gray-700 hover:text-[#8a5a33] text-base">
                                        ADMINISTRAÇÃO
                                    </Link>
                                )}
                                <Link href="/dashboard" className="block text-gray-700 hover:text-[#8a5a33] text-base ">
                                    CATÁLOGO
                                </Link>
                                <Link href="/CarrinhoDeCompra" className="block text-gray-700 hover:text-[#8a5a33] text-base">
                                    CARRINHO
                                </Link>
                                <Link href="/MeusPedidos" className="block text-gray-700 hover:text-[#8a5a33] text-base">
                                    MEUS PEDIDOS
                                </Link>
                                 <Link href="/MeusCupons" className="block text-gray-700 hover:text-[#8a5a33] text-base">
                                    MEUS CUPONS
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/" className="block text-gray-700 hover:text-[#8a5a33] text-base">
                                    CATÁLOGO
                                </Link>

                                <Link href="/CarrinhoWL" className="block text-gray-700 hover:text-[#8a5a33] text-base">

                                    CARRINHO
                                </Link>
                            </>
                        )}


                        <Link href="/sobre" className="block text-gray-700 hover:text-[#8a5a33] text-base">
                            SOBRE
                        </Link>
                        {user ? (
                            <>
                                <Link href={route('profile.edit')} className="block text-gray-700 hover:text-[#8a5a33] text-base">
                                    PERFIL
                                </Link>
                                <Link
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                    className="block w-full text-left text-gray-700 hover:text-[#8a5a33] text-base"
                                >
                                    SAIR
                                </Link>
                            </>
                        ) : (
                            <Link href="/login" className="block text-gray-700 hover:text-[#8a5a33]">
                                LOGIN
                            </Link>
                        )}

                    </div>

                )}
            </header>

            {/* Conteúdo */}
            <main className="py-6">{children}</main>
        </div>


    );
 <style>
        {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Playfair+Display:wght@400;700&display=swap');

            .font-poppins {
                font-family: 'Poppins', sans-serif;
            }

            .font-playfair {
                font-family: 'Playfair Display', serif;
            }
        `}
    </style>
}

