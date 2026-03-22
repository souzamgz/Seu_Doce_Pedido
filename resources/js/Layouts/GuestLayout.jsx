import React, { useState, useEffect } from "react";

export default function GuestLayout({ children }) {
    // Frases rotativas
    const frases = [
        "Doces momentos por aqui!",
        "Feito com amor!",
        "Seu dia mais doce!"

    ];

    const [fraseAtual, setFraseAtual] = useState(0);

    useEffect(() => {
        const intervalo = setInterval(() => {
            setFraseAtual((prev) => (prev + 1) % frases.length);
        }, 4000); // troca a cada 4s
        return () => clearInterval(intervalo);
    }, []);

    return (
        <div className="min-h-screen flex">
            {/* Lado esquerdo */}
            <div
                className="hidden md:flex md:w-1/2 flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#613d20] via-[#8a5a33] to-[#613d20] animate-gradient"
                style={{ perspective: "800px" }}
            >
                <div className="absolute w-80 h-80 bg-white rounded-full blur-3xl opacity-40 z-10 animate-pulse" />

                {/* Logo com efeito hover */}
                <img
                    src="imagens/Logo_Original - Editado.png"
                    alt="Logo"
                    className="w-60 h-60 z-20 relative object-contain animate-float"
                    width="600"
                    height="600"
                />




                {/* Texto com animação de digitação */}
                <p
                    key={fraseAtual}
                    className="mt-8 text-white text-2x1 tracking-wide text-center animate-fadeInUp font-Montserrat"
                >
                    {frases[fraseAtual]}
                </p>





                <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

.font-Montserrat {
  font-family: 'Montserrat', sans-serif;
}




                    /* Gradiente animado */
                    @keyframes gradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }

                    .animate-gradient {
                        background-size: 300% 300%;
                        animation: gradient 10s ease infinite;
                    }

                    /* Animação digitação */
                    @keyframes typing {
                        from { width: 0 }
                        to { width: 100% }
                    }
                    @keyframes blink {
                        50% { border-color: transparent }
                    }

                    .animate-typing {
                        display: inline-block;
                        overflow: hidden;
                        white-space: nowrap;
                        border-right: 2px solid;
                        animation: typing 3s steps(30, end), blink 0.8s infinite;
                    }
                `}</style>
            </div>

            {/* Lado direito */}
            <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center p-8 relative">
                {children}
            </div>
        </div>
    );
}
