"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false); 
    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* 1. BOTÓN FLOTANTE (Móvil) - Esquina inferior derecha */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-1000 p-4 bg-blue-600 text-white rounded-full shadow-2xl xl:hidden hover:scale-110 hover:bg-blue-700 transition-all duration-300"
                aria-label="Toggle Menu"
            >
                {isOpen ? (
                    // Icono X (Cerrar)
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    // Icono Hamburguesa (Abrir)
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* 2. OVERLAY (Fondo oscuro en móvil) */}
            {isOpen && (
                <div 
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-990 bg-black/50 backdrop-blur-sm xl:hidden transition-opacity"
                />
            )}

            {/* 3. SIDEBAR (Contenedor Principal) */}
            <aside
                className={`fixed inset-y-0 left-0 z-995 w-64 p-4 my-4 ml-4
                transition-transform duration-300 ease-in-out
                xl:translate-x-0 xl:ml-6 xl:block 
                ${isOpen ? "translate-x-0" : "-translate-x-[120%]"} 
                `} 
                aria-expanded={isOpen}
            >
                {/* TARJETA VISUAL (Fondo blanco, sombra, bordes) */}
                <div className="flex flex-col h-full bg-white shadow-xl rounded-2xl overflow-hidden">
                    
                    {/* Header / Logo */}
                    <div className="h-20 flex items-center px-8 border-b border-gray-100">
                        <Link href="/" onClick={handleLinkClick} className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg shadow-md shadow-blue-500/20">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h1 className="text-slate-800 text-xl font-bold tracking-tight">
                                CREG Data
                            </h1>
                        </Link>
                    </div>
                    {/* Lista de Navegación */}
                    <div className="flex-1 px-4 py-6 overflow-y-auto">
                        <ul className="flex flex-col space-y-1">
                            {/* Población */}
                            <li>
                                <Link
                                    href="/poblacion"
                                    onClick={handleLinkClick}
                                    className={`flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors
                                    ${pathname === '/poblacion'
                                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                                        : 'text-slate-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`mr-2 flex items-center justify-center w-8 h-8 rounded-lg 
                                        ${pathname === '/poblacion' ? 'text-white' : 'text-orange-500 bg-orange-50'}`}>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    Población
                                </Link>
                            </li>
                            {/* Espacio para futuras secciones */}
                    

                        </ul>
                    </div>
                </div>
            </aside>
        </>
    );
}