"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, PieChart, Users, Earth, Globe, MapMinus, TableProperties, Landmark } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false); 

    const [activeMenu, setActiveMenu] = useState(null);

    const toggleMenu = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };
    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-1000 p-4 bg-blue-600 text-white rounded-full shadow-2xl hover:scale-110 hover:bg-blue-700 transition-all duration-300"
                aria-label="Toggle Menu"
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {isOpen && (
                <div 
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-990 bg-black/50 backdrop-blur-sm transition-opacity"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-995 w-64 p-4 my-4 ml-4
                transition-transform duration-300 ease-in-out
                xl:ml-6 xl:block 
                ${isOpen ? "translate-x-0" : "-translate-x-[120%]"} 
                `} 
            >
                <div className="flex flex-col h-full bg-white shadow-xl rounded-2xl overflow-hidden">
                    
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

                    <div className="flex-1 px-4 py-6 overflow-y-auto">
                        <ul className="flex flex-col space-y-1"> 
                            <li>
                                <button
                                    onClick={() => toggleMenu('territorio')}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-lg transition-colors mt-1
                                    ${activeMenu === 'territorio' 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'text-slate-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`mr-2 flex items-center justify-center w-8 h-8 rounded-lg 
                                            ${activeMenu === 'territorio' ? 'text-blue-600 bg-blue-100' : 'text-green-500 bg-green-50'}`}>
                                            <Earth className="w-4 h-4" />
                                        </div>
                                        Territorio
                                    </div>
                                    <ChevronDown 
                                        className={`w-4 h-4 transition-transform duration-200 ${activeMenu === 'territorio' ? 'rotate-180' : ''}`} 
                                    />
                                </button>
                                {activeMenu === 'territorio' && (
                                    <ul className="flex flex-col space-y-1 mt-1 pl-4 animate-in slide-in-from-top-2 duration-200">
                                        <li>
                                            <Link
                                                href="/"
                                                onClick={handleLinkClick}
                                                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ml-8
                                                ${pathname === '/' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700 hover:bg-gray-50'}`}
                                            >
                                                <MapMinus className="w-4 h-4 mr-2" />
                                                Mapa
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            
                            <li>
                                <button
                                    onClick={() => toggleMenu('poblacion')}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-lg transition-colors mt-1
                                    ${activeMenu === 'poblacion' 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'text-slate-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`mr-2 flex items-center justify-center w-8 h-8 rounded-lg 
                                            ${activeMenu === 'poblacion' ? 'text-blue-600 bg-blue-100' : 'text-green-500 bg-green-50'}`}>
                                            <Users className="w-4 h-4" />
                                        </div>
                                        Poblacion
                                    </div>
                                    <ChevronDown 
                                        className={`w-4 h-4 transition-transform duration-200 ${activeMenu === 'poblacion' ? 'rotate-180' : ''}`} 
                                    />
                                </button>
                                {activeMenu === 'poblacion' && (
                                    <ul className="flex flex-col space-y-1 mt-1 pl-4 animate-in slide-in-from-top-2 duration-200">
                                        <li>
                                            <Link
                                                href="/poblacion/reportes"
                                                onClick={handleLinkClick}
                                                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ml-8
                                                ${pathname === '/poblacion/reportes' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700 hover:bg-gray-50'}`}
                                            >
                                                <TableProperties className="w-4 h-4 mr-2" />
                                                Reportes Poblacionales
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/poblacion/visDatos"
                                                onClick={handleLinkClick}
                                                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ml-8
                                                ${pathname === '/poblacion/visDatos' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700 hover:bg-gray-50'}`}
                                            >
                                                <Globe className="w-4 h-4 mr-2" />
                                                VisPoblacion
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>


                            <li>
                                <button
                                    onClick={() => toggleMenu('gobierno')}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-lg transition-colors mt-1
                                    ${activeMenu === 'gobierno' 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'text-slate-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`mr-2 flex items-center justify-center w-8 h-8 rounded-lg 
                                            ${activeMenu === 'gobierno' ? 'text-blue-600 bg-blue-100' : 'text-green-500 bg-green-50'}`}>
                                            <Landmark className="w-4 h-4" />
                                        </div>
                                        Gobierno
                                    </div>
                                    <ChevronDown 
                                        className={`w-4 h-4 transition-transform duration-200 ${activeMenu === 'gobierno' ? 'rotate-180' : ''}`} 
                                    />
                                </button>
                                {activeMenu === 'gobierno' && (
                                    <ul className="flex flex-col space-y-1 mt-1 pl-4 animate-in slide-in-from-top-2 duration-200">
                                        <li>
                                            <Link
                                                href="/"
                                                onClick={handleLinkClick}
                                                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ml-8
                                                ${pathname === '/' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700 hover:bg-gray-50'}`}
                                            >
                                                <Globe className="w-4 h-4 mr-2" />
                                                Datos Financieros
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/"
                                                onClick={handleLinkClick}
                                                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ml-8
                                                ${pathname === '/' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700 hover:bg-gray-50'}`}
                                            >
                                                <TableProperties className="w-4 h-4 mr-2" />
                                                Reportes Financieros
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/"
                                                onClick={handleLinkClick}
                                                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ml-8
                                                ${pathname === '/' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700 hover:bg-gray-50'}`}
                                            >
                                                <Globe className="w-4 h-4 mr-2" />
                                                VisDatos Financieros
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>

                            {/*Mas implementaciones de botones */}
                        </ul>
                    </div>
                </div>
            </aside>
        </>
    );
}