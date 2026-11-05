import React from 'react';
import { INSTITUTIONAL_CREDITS, OFFICIAL_LINKS } from '../data/mntData';
import { ExternalLink, Globe, Heart, Shield, Download, FileText } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-[#141211] text-stone-300 border-t border-[#262320] pt-12 pb-24 lg:pb-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Bloque 1: Matriz Institucional y Logotipos Oficiales */}
        <div className="border-b border-[#2D2A26] pb-10">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#D99B26] mb-6 text-center sm:text-left">
            Instituciones Convocantes y Organizadoras
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
            {/* Cultura Federal */}
            <div className="p-4 rounded-xl bg-[#1C1A18] border border-[#2D2A26] flex flex-col justify-center text-center sm:text-left">
              <span className="font-brand font-black text-white text-lg tracking-wider">CULTURA</span>
              <span className="text-[11px] text-stone-400 font-medium">Secretaría de Cultura Federal</span>
            </div>

            {/* INBAL */}
            <div className="p-4 rounded-xl bg-[#1C1A18] border border-[#2D2A26] flex flex-col justify-center text-center sm:text-left">
              <span className="font-brand font-black text-white text-lg tracking-wider">INBAL</span>
              <span className="text-[11px] text-stone-400 font-medium">Bellas Artes y Literatura</span>
            </div>

            {/* CNT */}
            <div className="p-4 rounded-xl bg-[#1C1A18] border border-[#2D2A26] flex flex-col justify-center text-center sm:text-left">
              <span className="font-display font-extrabold text-[#D99B26] text-base">CNT</span>
              <span className="text-[11px] text-stone-400 font-medium">Coordinación Nacional de Teatro</span>
            </div>

            {/* SECULT Querétaro */}
            <div className="p-4 rounded-xl bg-[#1C1A18] border border-[#2D2A26] flex flex-col justify-center text-center sm:text-left">
              <span className="font-display font-extrabold text-[#8C3B2B] text-base">SECULT QRO</span>
              <span className="text-[11px] text-stone-400 font-medium">Gobierno del Estado de Querétaro</span>
            </div>
          </div>
        </div>

        {/* Bloque 2 & 3: Mapa del Sitio + Canales Oficiales + Redes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          {/* Columna 1: Presentación 46 MNT */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#D99B26] text-[#1F1D1B] flex items-center justify-center font-brand font-black text-xs">
                46
              </div>
              <span className="font-bold text-white text-sm">46 Muestra Nacional de Teatro</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              Encuentro anual representativo del teatro mexicano. Edición Querétaro 2026: 30 puestas en escena de 27 estados, 21 sedes y actividades de reflexión gremial.
            </p>
            <div className="text-[11px] text-[#D99B26]">
              "Sean bienvenidxs a respirar juntxs"
            </div>
          </div>

          {/* Columna 2: Mapa del Sitio */}
          <div className="space-y-2.5">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button onClick={() => onSelectTab('inicio')} className="hover:text-[#D99B26] transition-colors">
                  Inicio / Portada
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('programa')} className="hover:text-[#D99B26] transition-colors">
                  Programa General de Obras
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('sedes')} className="hover:text-[#D99B26] transition-colors">
                  Sedes Escénicas y Mapa GPS
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('curaduria')} className="hover:text-[#D99B26] transition-colors">
                  Curaduría y Dirección Artística
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('actividades')} className="hover:text-[#D99B26] transition-colors">
                  Actividades Académicas y FELIT
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 3: Canales Oficiales y Redes */}
          <div className="space-y-2.5">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Canales Oficiales
            </h4>
            <div className="space-y-2 text-stone-400">
              <a
                href="https://mnt.inba.gob.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#E6B040] hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>mnt.inba.gob.mx</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={OFFICIAL_LINKS.carteleraOficial}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-stone-200 hover:text-[#D99B26] transition-colors font-semibold"
                title="Abrir Cartelera Oficial en línea (bit.ly/46MNTCartelera)"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#D99B26]" />
                <span>Cartelera Oficial: bit.ly/46MNTCartelera</span>
              </a>

              <a
                href={OFFICIAL_LINKS.programaPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#D99B26] hover:underline font-semibold"
                title="Descargar Programa Oficial en PDF (Gobierno del Estado de Querétaro)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Programa en PDF Oficial</span>
              </a>
              <div className="pt-1">
                <span className="text-stone-500 font-semibold block text-[11px]">REDES SOCIALES</span>
                <p className="mt-1">@muestranacionaldeteatro</p>
                <p>@MNTeatro · @teatroinbal</p>
                <p>@secultqro · @seculqro</p>
              </div>
            </div>
          </div>

          {/* Columna 4: Dirección Artística 46 MNT */}
          <div className="space-y-2.5">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Dirección Artística
            </h4>
            <ul className="space-y-1 text-stone-400 text-xs">
              {INSTITUTIONAL_CREDITS.direccionArtistica.map((name) => (
                <li key={name} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D99B26]" />
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bloque 4: Legales y Créditos Digitales */}
        <div className="border-t border-[#262320] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 text-center sm:text-left">
          <p className="max-w-2xl leading-relaxed">
            "Este programa es público, ajeno a cualquier partido político. Queda prohibido el uso para fines distintos a los establecidos en el programa."
          </p>
          <div className="shrink-0 flex items-center gap-2">
            <span>46 MNT Querétaro 2026 · INBAL / SECULT QRO</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
