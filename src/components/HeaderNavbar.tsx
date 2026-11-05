import React, { useState } from 'react';
import { Menu, X, Calendar, MapPin, BookOpen, Users, Compass, Bookmark, Download, ExternalLink } from 'lucide-react';
import { OFFICIAL_LINKS } from '../data/mntData';

interface HeaderNavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  savedCount: number;
  onOpenItinerary: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
  onOpenItinerary
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'inicio', label: 'Inicio', icon: Compass },
    { id: 'programa', label: 'Programa General', icon: Calendar },
    { id: 'sedes', label: 'Sedes y Mapa', icon: MapPin },
    { id: 'curaduria', label: 'Curaduría', icon: BookOpen },
    { id: 'actividades', label: 'Actividades Académicas', icon: Users },
  ];

  const handleLinkClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#1F1D1B] text-white shadow-md border-b border-[#34302C]">
      {/* Barra Superior Institucional (sólo visible en tablet/desktop para no saturar la pantalla móvil) */}
      <div className="hidden sm:block bg-[#141312] border-b border-[#2C2926] text-xs text-stone-400 py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-[11px] font-medium">
          <div className="flex items-center gap-3 truncate">
            <span className="text-[#D99B26] font-semibold tracking-wider uppercase">Cultura</span>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <span className="truncate hidden sm:inline">Instituto Nacional de Bellas Artes y Literatura</span>
            <span className="text-stone-600 hidden md:inline">|</span>
            <span className="truncate hidden md:inline">Gobierno del Estado de Querétaro</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-stone-300">Querétaro · Noviembre 2026</span>
          </div>
        </div>
      </div>

      {/* Barra Principal de Navegación (Compacta y ergonómica en móvil: h-14) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Zone: 46 MNT */}
        <button
          onClick={() => handleLinkClick('inicio')}
          className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0 min-h-[44px] cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#D99B26] text-[#1F1D1B] flex flex-col items-center justify-center font-brand font-black text-xs sm:text-sm tracking-tighter leading-none shadow group-hover:bg-[#E6B040] transition-colors">
            <span>46</span>
            <span className="text-[8px] sm:text-[9px] tracking-widest font-sans font-bold">MNT</span>
          </div>
          <div>
            <div className="font-display font-extrabold text-sm sm:text-base tracking-tight leading-none text-white group-hover:text-[#D99B26] transition-colors">
              MUESTRA NACIONAL <span className="font-light text-[#D99B26] italic">de</span> TEATRO
            </div>
            <div className="text-[10px] sm:text-[11px] font-medium text-stone-400 tracking-wider">
              QUERÉTARO · 2026
            </div>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-300">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`py-1 relative whitespace-nowrap transition-colors ${
                  isActive ? 'text-[#D99B26] font-semibold' : 'hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D99B26] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons Zone */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mi Itinerario Button (visible on tablet/desktop; on mobile it is anchored in the bottom bar) */}
          <button
            onClick={onOpenItinerary}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#2D2A26] hover:bg-[#3D3934] text-stone-200 border border-stone-700 transition-colors cursor-pointer"
            title="Mi Itinerario de Funciones"
          >
            <Bookmark className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-[#D99B26] fill-[#D99B26]' : 'text-stone-400'}`} />
            <span>Mi Itinerario</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-[#D99B26] text-[#1F1D1B] font-bold rounded-full text-[10px]">
                {savedCount}
              </span>
            )}
          </button>

          {/* Descargar Programa PDF */}
          <a
            href={OFFICIAL_LINKS.programaPdf}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#D99B26] hover:bg-[#E6B040] text-[#1F1D1B] transition-colors shadow-sm cursor-pointer"
            title="Descargar Programa Oficial en PDF (Gobierno del Estado de Querétaro)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Programa PDF</span>
          </a>

          {/* Mobile Hamburguer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 focus:outline-none"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#D99B26]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1A1817] border-b border-stone-800 px-4 py-5 shadow-2xl animate-fade-in">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#D99B26]/15 text-[#D99B26] font-semibold'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}

            <div className="pt-3 mt-2 border-t border-stone-800 flex flex-col gap-2">
              <a
                href={OFFICIAL_LINKS.carteleraOficial}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold rounded bg-[#8C3B2B] text-white hover:bg-[#A34533] transition-colors shadow-sm"
              >
                <span>Cartelera Oficial bit.ly</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={OFFICIAL_LINKS.programaPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold rounded bg-[#D99B26] text-[#1F1D1B] hover:bg-[#E6B040] transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Programa en PDF Oficial</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
