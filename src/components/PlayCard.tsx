import React from 'react';
import { Play } from '../data/mntData';
import { MapPin, Clock, Bookmark, ArrowRight, Sparkles } from 'lucide-react';

interface PlayCardProps {
  play: Play;
  onSelect: (play: Play) => void;
  isSaved?: boolean;
  onToggleSave?: (play: Play, e: React.MouseEvent) => void;
}

export const PlayCard: React.FC<PlayCardProps> = ({
  play,
  onSelect,
  isSaved = false,
  onToggleSave
}) => {
  return (
    <article
      onClick={() => onSelect(play)}
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
    >
      {/* Media Slot (16:9 / 4:3) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900">
        <img
          src={play.image}
          alt={`Puesta en escena ${play.title} por ${play.company}`}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1D1B]/90 via-[#1F1D1B]/30 to-black/20" />

        {/* Zona Superior (Header Badges) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {/* Badge Izquierdo: Estado de Origen */}
          <span className="bg-[#1F1D1B]/80 backdrop-blur-md text-stone-200 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm border border-stone-700/60">
            {play.state}
          </span>

          {/* Badge Derecho: Clasificación de Edad */}
          <span className="bg-[#8C3B2B] text-white text-[11px] font-extrabold px-2.5 py-1 rounded shadow-sm">
            {play.ageRecommendation}
          </span>
        </div>

        {/* Botón Bookmark / Guardar en Itinerario */}
        {onToggleSave && (
          <button
            onClick={(e) => onToggleSave(play, e)}
            className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all z-10 ${
              isSaved
                ? 'bg-[#D99B26] text-[#1F1D1B] border-[#D99B26] shadow'
                : 'bg-black/50 hover:bg-black/80 text-white border-white/20'
            }`}
            title={isSaved ? 'Quitar de mi itinerario' : 'Guardar en mi itinerario'}
            aria-label={`Guardar ${play.title} en mi itinerario`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Fecha y Hora sobre la foto */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
          <div className="bg-[#D99B26] text-[#1F1D1B] font-extrabold text-xs px-2.5 py-0.5 rounded shadow">
            {play.dayLabel.toUpperCase()}
          </div>
          <span className="text-xs font-bold text-amber-200 drop-shadow">
            {play.timeDisplay}
          </span>
        </div>
      </div>

      {/* Zona Central (Content Slot) */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-bold text-lg sm:text-xl text-[#1F1D1B] group-hover:text-[#D99B26] transition-colors line-clamp-2 leading-snug">
            {play.title}
          </h3>

          {play.subtitle && (
            <p className="text-xs text-stone-500 font-medium line-clamp-1 mt-0.5">
              {play.subtitle}
            </p>
          )}

          <p className="text-xs text-[#8C3B2B] font-semibold italic mt-1 line-clamp-1">
            {play.company}
          </p>

          {/* Sede */}
          <div className="flex items-start gap-1.5 text-xs text-stone-600 mt-2.5">
            <MapPin className="w-3.5 h-3.5 text-[#D99B26] shrink-0 mt-0.5" />
            <span className="line-clamp-1 font-medium">{play.venue}</span>
          </div>
        </div>

        {/* Zona Inferior (Footer Metadatos) */}
        <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{play.durationMinutes} min</span>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D99B26] group-hover:translate-x-0.5 transition-transform">
            Ver detalle
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </article>
  );
};
