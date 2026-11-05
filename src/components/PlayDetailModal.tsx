import React, { useState } from 'react';
import { Play } from '../data/mntData';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';
import { 
  X, Calendar, Clock, MapPin, Bookmark, Check, Share2, 
  ExternalLink, Sparkles, AlertCircle, ArrowRight 
} from 'lucide-react';

interface PlayDetailModalProps {
  play: Play | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (play: Play) => void;
  onSelectPlay: (play: Play) => void;
  allPlays: Play[];
}

export const PlayDetailModal: React.FC<PlayDetailModalProps> = ({
  play,
  onClose,
  isSaved,
  onToggleSave,
  onSelectPlay,
  allPlays
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!play) return null;

  // Find related plays (same venue or same day, excluding current)
  const relatedPlays = allPlays
    .filter(p => p.id !== play.id && (p.venueId === play.venueId || p.dayNumber === play.dayNumber))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${play.title} - 46 MNT Querétaro 2026`,
        text: `${play.title} por ${play.company}. Función: ${play.dayLabel} a las ${play.timeDisplay} en ${play.venue}.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `${play.title} - 46 MNT Querétaro 2026: ${play.dayLabel} ${play.timeDisplay} en ${play.venue}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      {/* Modal Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-none sm:rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[100vh] sm:max-h-[92vh] flex flex-col text-left">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors"
          aria-label="Cerrar detalle"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pb-16 sm:pb-8">
          {/* Slot 1: Hero de Puesta en Escena */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-stone-900 overflow-hidden">
            <img
              src={play.image}
              alt={play.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F1D1B] via-[#1F1D1B]/50 to-transparent" />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="bg-[#1F1D1B]/90 backdrop-blur-md text-stone-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded border border-stone-700">
                {play.state}
              </span>
              <span className="bg-[#8C3B2B] text-white text-xs font-black px-3 py-1 rounded">
                {play.ageRecommendation}
              </span>
              <span className="bg-[#D99B26] text-[#1F1D1B] text-xs font-extrabold px-3 py-1 rounded">
                {play.durationMinutes} min
              </span>
            </div>

            {/* Title & Company bottom overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-white">
              {play.collaborations && (
                <p className="text-xs text-amber-300 font-medium tracking-wide mb-1">
                  {play.collaborations}
                </p>
              )}
              <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white leading-tight">
                {play.title}
              </h1>
              {play.subtitle && (
                <p className="text-sm sm:text-base text-stone-300 font-medium mt-1">
                  {play.subtitle}
                </p>
              )}
              <p className="text-sm text-[#E6B040] font-semibold italic mt-1.5">
                {play.company}
              </p>
              {play.photoCredit && (
                <p className="text-[10px] text-stone-400 mt-2 italic">
                  Foto: {play.photoCredit}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Slot 2: Panel de Datos de Función */}
            <div className="bg-[#F9F6F0] rounded-xl p-4 sm:p-5 border border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Fecha y Hora */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-[#D99B26]/20 text-[#D99B26] shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Fecha y Hora</div>
                  <div className="font-bold text-sm text-[#1F1D1B]">{play.dayLabel}</div>
                  <div className="text-xs text-stone-600 font-semibold">{play.timeDisplay} (Duración {play.durationMinutes}m)</div>
                </div>
              </div>

              {/* Sede y Dirección */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-[#8C3B2B]/20 text-[#8C3B2B] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Sede Escénica</div>
                  <div className="font-bold text-sm text-[#1F1D1B]">{play.venue}</div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(play.venue + ' Queretaro')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#8C3B2B] hover:underline font-semibold mt-0.5"
                  >
                    <span>Ver en Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Acciones de Calendario y Guardado */}
              <div className="flex flex-col gap-2 justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleSave(play)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      isSaved
                        ? 'bg-[#D99B26] text-[#1F1D1B] shadow-sm'
                        : 'bg-stone-200 hover:bg-stone-300 text-[#1F1D1B]'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    <span>{isSaved ? 'Guardada en Itinerario' : 'Guardar en Mi Ruta'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors"
                    title="Compartir obra"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-green-700" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Google Calendar & .ics export */}
                <div className="flex items-center gap-2 text-[11px]">
                  <a
                    href={getGoogleCalendarUrl(play)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded text-center font-medium transition-colors"
                  >
                    + Google Calendar
                  </a>
                  <button
                    onClick={() => downloadIcsFile(play)}
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded text-center font-medium transition-colors"
                  >
                    Descargar .ics (iCal)
                  </button>
                </div>
              </div>
            </div>

            {/* Slot 3: Fichas Modulares de Contenido */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Columna Izquierda (Sinopsis Principal) */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#1F1D1B] border-b border-stone-200 pb-2 mb-3">
                    Sinopsis
                  </h3>
                  <p className="font-editorial text-base sm:text-lg text-stone-800 leading-relaxed">
                    {play.synopsis}
                  </p>
                </div>

                {/* Ficha Artística */}
                <div>
                  <h3 className="font-display font-bold text-lg text-[#1F1D1B] border-b border-stone-200 pb-2 mb-3">
                    Ficha Artística
                  </h3>
                  <div className="space-y-3 text-sm text-stone-700 leading-relaxed">
                    <div>
                      <span className="font-bold text-[#1F1D1B]">{play.authorDirection}</span>
                    </div>
                    <div>
                      <span className="text-stone-600">{play.cast}</span>
                    </div>
                  </div>
                </div>

                {/* Ficha Técnica */}
                <div>
                  <h3 className="font-display font-bold text-lg text-[#1F1D1B] border-b border-stone-200 pb-2 mb-3">
                    Ficha Técnica y Producción
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {play.technicalTeam}
                  </p>
                </div>
              </div>

              {/* Columna Derecha (Créditos Institucionales & Apoyos) */}
              <div className="space-y-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-3">
                  <h4 className="font-display font-bold text-sm text-[#1F1D1B] uppercase tracking-wider">
                    Apoyos e Instituciones
                  </h4>
                  {play.institutionalSupport ? (
                    <p className="leading-relaxed text-stone-700">
                      {play.institutionalSupport}
                    </p>
                  ) : (
                    <p className="italic text-stone-400">
                      Producción participante en la 46 Muestra Nacional de Teatro seleccionada por Convocatoria Nacional.
                    </p>
                  )}
                  <div className="pt-3 border-t border-stone-200 text-[11px] text-stone-500">
                    <p className="font-semibold text-stone-700">Coordinación Nacional de Teatro · INBAL</p>
                    <p>Secretaría de Cultura del Gobierno de México</p>
                  </div>
                </div>

                {/* Aviso de Ingreso */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#D99B26] shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    Todas las funciones de la 46 MNT son de <strong>entrada libre</strong>. Se recomienda llegar 30 minutos antes para acceder a las salas conforme al aforo de cada recinto.
                  </p>
                </div>
              </div>
            </div>

            {/* Slot 5: Recomendaciones (Obras Relacionadas) */}
            {relatedPlays.length > 0 && (
              <div className="pt-6 border-t border-stone-200">
                <h3 className="font-display font-bold text-lg text-[#1F1D1B] mb-4">
                  Otras Funciones Recomendadas (Misma fecha o sede)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedPlays.map((relPlay) => (
                    <div
                      key={relPlay.id}
                      onClick={() => onSelectPlay(relPlay)}
                      className="group p-3.5 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200/80 cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 mb-1">
                          <span className="text-[#8C3B2B]">{relPlay.state}</span>
                          <span>{relPlay.dayLabel.split(' ')[0]} {relPlay.timeDisplay}</span>
                        </div>
                        <h4 className="font-bold text-sm text-[#1F1D1B] group-hover:text-[#D99B26] transition-colors line-clamp-1">
                          {relPlay.title}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                          {relPlay.company}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#D99B26] mt-3">
                        <span>Ver función</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
